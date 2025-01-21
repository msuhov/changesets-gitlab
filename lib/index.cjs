'use strict';

var rest = require('@gitbeaker/rest');
var globalAgent = require('global-agent');
var core = require('@actions/core');
var dotenv = require('dotenv');

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var _a, _b, _c, _d, _e;
dotenv.config();
let isGitlabTokenValidated = false;
const env = __spreadProps(__spreadValues({}, process.env), {
  CI_MERGE_REQUEST_IID: +process.env.CI_MERGE_REQUEST_IID,
  GITLAB_HOST: (_b = (_a = process.env.GITLAB_HOST) != null ? _a : process.env.CI_SERVER_URL) != null ? _b : "https://gitlab.com",
  CI_SERVER_HOST: (_c = process.env.CI_SERVER_HOST) != null ? _c : "gitlab.com",
  GITLAB_CI_USER_EMAIL: process.env.GITLAB_CI_USER_EMAIL,
  GITLAB_COMMENT_TYPE: (_d = process.env.GITLAB_COMMENT_TYPE) != null ? _d : "discussion",
  DEBUG_GITLAB_CREDENTIAL: (_e = process.env.DEBUG_GITLAB_CREDENTIAL) != null ? _e : "false",
  // only check for the token if we are explicitly using it
  // eslint-disable-next-line sonar/function-name
  get GITLAB_TOKEN() {
    if (!isGitlabTokenValidated) {
      isGitlabTokenValidated = true;
      if (!process.env.GITLAB_TOKEN) {
        core.setFailed("Please add the `GITLAB_TOKEN` to the changesets action");
      }
    }
    return process.env.GITLAB_TOKEN;
  }
});

const PROXY_PROPS = ["http_proxy", "https_proxy", "no_proxy"];
const createApi = (gitlabToken) => {
  globalAgent.bootstrap();
  for (const prop of PROXY_PROPS) {
    const uProp = prop.toUpperCase();
    const value = process.env[uProp] || process.env[prop];
    if (value) {
      GLOBAL_AGENT[uProp] = value;
    }
  }
  const token = gitlabToken || env.GITLAB_TOKEN;
  const host = env.GITLAB_HOST;
  switch (env.GITLAB_TOKEN_TYPE) {
    case "job": {
      return new rest.Gitlab({
        host,
        jobToken: token
      });
    }
    case "oauth": {
      return new rest.Gitlab({
        host,
        oauthToken: token
      });
    }
    default: {
      return new rest.Gitlab({
        host,
        token
      });
    }
  }
};

exports.createApi = createApi;
