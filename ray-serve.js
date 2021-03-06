"use strict"
const express = require('express');
const dns = require('dns');
const os = require('os');
const fs = require('ray-fs');
const taken = require('ray-taken');
const core = require('ray-core');
const rayserveAuthors = "Ray Voice and Anna Voice";
const rayserveVersion = "v2.2.3";

module.exports = {
  value: 0,
  app: express(),
  port: 4000,
  latency: 0,
  hostname: "localhost",
  showPort: (hostname, port)=>{
     console.log(`Server is listening at ${hostname}:${port}`);
   },
  serveJSON: function () {
    const node = taken.take(arguments).getNodeNames().value[0]; 
    const json = taken.take(arguments).getObjArgs().value[0]; 
    const callbackServeSend = taken.take(arguments).getFuncArgs().value[0]; 
    const callbackCoreSend = taken.take(arguments).getFuncArgs().value[1];
    core.funcAnime(callbackServeSend);

    if (node === undefined) {core.lastWords("NodeName invalid! (/home, /about)")}

    this.app.get(node, (req, res) => {
      core.sendJSON(res, json, this.latency, callbackCoreSend);
    });
    return this;
  },
  serveFile: function(node, file) {
    const callbackServeSend = taken.take(arguments).getFuncArgs().value[0]; 
    const callbackCoreSend = taken.take(arguments).getFuncArgs().value[1];
    core.funcAnime(callbackServeSend);

    this.app.get(node, (req, res) => {
      core.sendFile(res, file, this.latency, callbackCoreSend)
    });
    return this;
  },
  showRoot: function(serverName, versionName) {
    this.serveJSON("/", {Server:serverName, Version: versionName});
    return this;
  },
  listen: function(callback) {
   let methodUsed = core.argAssign(callback, ()=>{this.showPort(this.hostname, this.port)});
   this.app.listen(this.port, methodUsed);
  },
  getIPV4: function(callback) {
    dns.lookup(os.hostname(), (err, add, fam) => {callback(err,add,fam)});
    return this;
  },
  static: function(dir) {
    this.app.use(express.static(dir));
    return this;
  }
}

