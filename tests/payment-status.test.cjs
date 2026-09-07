const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, "../lib/backend.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const settle = () => new Promise(resolve => setImmediate(resolve));
function load(fetch) {
 const timeouts = new Map(), intervals = new Map(); let id = 0;
 const context = { exports: {}, require: () => ({getApiBaseUrl: () => "https://test.invalid"}), fetch, AbortController, AbortSignal, TextDecoder,
  setTimeout: fn => { timeouts.set(++id,fn); return id; }, clearTimeout: id => timeouts.delete(id),
  setInterval: fn => { intervals.set(++id,fn); return id; }, clearInterval: id => intervals.delete(id),
 };
 vm.runInNewContext(source, context);
 return {api:context.exports,timeouts,intervals};
}
const pending = { id:"payment-1", status:"pending" };
function snapshot(payment) { return {ok:true,text:async()=>JSON.stringify({success:true,data:payment})}; }
function closedStream() { return {ok:true,body:{getReader:()=>({read:async()=>({done:true}),cancel:async()=>{},releaseLock(){}})}}; }
test("reconnects a closed stream and stops all timers on unsubscribe", async()=>{
 let streams=0;
 const h=load(async url=>{if(url.endsWith("/events")){streams++;return closedStream();}return snapshot(pending);});
 const stop=h.api.subscribeToPaymentStatus("token","payment-1",()=>{},()=>{});
 await settle(); assert.equal(streams,1); assert.equal(h.timeouts.size,1);
 const [id,retry]=h.timeouts.entries().next().value; h.timeouts.delete(id);retry();await settle();
 assert.equal(streams,2);stop();assert.equal(h.timeouts.size,0);assert.equal(h.intervals.size,0);
});
test("database fallback observes another replica's final state and stops tracking",async()=>{
 let value=pending;const received=[];
 const h=load(async url=>url.endsWith("/events")?closedStream():snapshot(value));
 h.api.subscribeToPaymentStatus("token","payment-1",p=>received.push(p.status),()=>{});
 await settle();value={...pending,status:"successful"};h.intervals.values().next().value();await settle();
 assert.deepEqual(received,["pending","successful"]);assert.equal(h.timeouts.size,0);assert.equal(h.intervals.size,0);
});
test("unsubscribe suppresses an in-flight database response",async()=>{
 let resolve;let received=0;
 const h=load(url=>url.endsWith("/events")?Promise.resolve(closedStream()):new Promise(r=>{resolve=r}));
 const stop=h.api.subscribeToPaymentStatus("token","payment-1",()=>received++,()=>{});
 stop();resolve(snapshot(pending));await settle();assert.equal(received,0);
});
