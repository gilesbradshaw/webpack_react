'use strict';
var _ = require('lodash');
var removeMd = require('remove-markdown');
var markdown = require('commonmark');

var mdReader = new markdown.Parser();
var mdWriter = new markdown.HtmlRenderer();

module.exports = {
  output: 'build',
  name: 'SurviveJS - Survive the jungles of JavaScript',
  author: 'Juho Vepsäläinen',
  deploy: {
    branch: 'gh-pages',
  },
  theme: {
    customStyles: 'custom.scss',
    // TODO: push blogTitle per path?
    blogTitle: 'Table of Contents',
    name: 'antwar-default-theme',
    navigation: [
      {title: 'Home', path: '/'},
      {title: 'Table of Contents', path: '/webpack_react'},
    ],
  },
  paths: {
    webpack_react: {
      path: function() {
        return require.context('./manuscript', true, /^\.\/.*\.md$/);
      },
      url: function(file, fileName) {
        return fileName.slice(0, fileName.length - 3);
      },
      title: function(file) {
        return removeMd(file.__content.split('\n')[0]);
      },
      date: function(file) {
        // dates aren't needed
        return;
      },
      content: function(file) {
        var content = file.__content.split('\n').slice(1).join('\n');

        return mdWriter.render(mdReader.parse(content));
      },
      preview: function(file) {
        var previewLimit = 150;
        var content = file.__content.split('\n').slice(1).join('\n');
        var stripped = removeMd(content);

        if(stripped.length > previewLimit) {
          return stripped.substr(0, previewLimit) + '…';
        }

        return stripped;
      },
      sort: function(files) {
        var order = require('raw!./manuscript/Book.txt').split('\n').filter(id);
        var ret = [];

        order.forEach(function(name) {
          var result = _.findWhere(files, {
            name: name,
          });

          if(result) {
            ret.unshift(result);
          }
        });

        return ret;
      },
    }
  }
};

function id(a) {return a;}
