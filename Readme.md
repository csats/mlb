Magnanimous Load Balancer
=========================

[![Build Status](https://travis-ci.org/csats/mlb.svg?branch=master)](https://travis-ci.org/csats/mlb)

Hi! I'm an auto-configuring nginx-based load balancer designed for use with Meteor applications.

The easiest way to run me is as a Docker container. A basic command might be as easy as this:

    docker run --rm -d -p 8080:8080 csats/mlb


SSL
---

SSL support works by mounting a volume at `/certs` that contains your SSL certificate and private
key. A command might look something like this:

    docker run --rm -v -d -p 8080:8080 /path/to/my/cert/dir:/certs csats/mlb
