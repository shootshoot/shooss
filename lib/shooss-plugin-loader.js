(function() {
  var ShoossPluginLoader, autobuildPlugin, basicAuth, express;

  express = require('express');

  basicAuth = require('./plugins/basic-auth');

  autobuildPlugin = require('./plugins/autobuild');

  ShoossPluginLoader = (function() {
    function ShoossPluginLoader(config, logger) {
      var pluginName, pluginNames, _i, _len, _ref;
      this.config = config;
      this.logger = logger;
      pluginNames = this.config.get("plugins");
      this.plugins = [];
      if (!pluginNames) {
        return;
      }
      this.logger.debug("Loading plugins [" + pluginNames + "]");
      _ref = pluginNames.split(',');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pluginName = _ref[_i];
        this.loadPlugin(pluginName);
      }
    }

    ShoossPluginLoader.prototype.loadPlugin = function(pluginName) {
      var error;
      this.logger.debug("Loading plugin " + pluginName);
      try {
        this.plugins.push(require("shooss-" + pluginName));
        return this.logger.debug("Loaded plugin " + pluginName);
      } catch (_error) {
        error = _error;
        throw "Unable to find plugin " + pluginName + ". Install it globally with:\n npm install -g shooss-" + pluginName;
      }
    };

    ShoossPluginLoader.prototype.inject = function(app) {
      var plugin, _i, _len, _ref, _results;
      this.logger.debug("Injecting plugins");
      if (this.config.has('username') && this.config.has('password')) {
        this.logger.debug('load plugin basic-auth');
        basicAuth.load(app, this.config, this.logger);
      }
      this.logger.debug('load plugin autobuild');
      autobuildPlugin.load(app, this.config, this.logger);
      _ref = this.plugins;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        plugin = _ref[_i];
        _results.push(plugin.load(server.app, express, this.config));
      }
      return _results;
    };

    module.exports = ShoossPluginLoader;

    return ShoossPluginLoader;

  })();

}).call(this);
