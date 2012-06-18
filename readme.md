ReC2S: Reliable Cloud Computing System
--------------------------------------

## I. Introduction
In the context of modern Cloud Computing the need for a developer/user to have the possibility  to deploy a set of virtual machines on different hypervisors or CSP is becoming more and more a necessity.

ReC2S is trying to join under a single management unit the possibility to do that by proposing a model and a framework for this. The main concept is the "lease", basically some virtual machines under a single management unit.

## II. Architecture
More technical details can be found in my master thesis, that can be found in "docs" directory.

## III. Implementation
The implementation is made in Node.JS v0.6.0 on backend, Grails on frontend and Java for the VMware ESX driver.

## IV. Deployment

#### The content:
* hypervisor-drivers - drivers for hypervisor or CSP. For now is working just the VMware one
* rec2s-certs - certificates for the modules
* rec2s-frontend - the entrypoint in the framework
* rec2s-globals - contains global data for use in the framework
* rec2s-gui - the graphical interface
* rec2s-hypervisor-manager - module that interfaces with various hypervisors/CPSs
* rec2s-lease-manager - stores the leases. It has 2 submodules: lease-manager api and lease manager
* rec2s-monitor - monitors the framework for lease preemption
* rec2s-scheduler - a lease scheduler for running on different hypervisors
* rec2s-tests - some tests
* rec2s-user-manager - holds data about the users
* rec2s-utils - utilities for the above modules

#### Instalation
At this time, the deployment must be made by hand, modifying the settings file for each module. Each module can be started independently. One variant is this:
gui, frontend, user-manager, lease-manager-api, lease-manager, scheduler, hypervisor-manager, monitor



The development and docs are in alpha stage and any suggestions are welcomed. For project history see http://sourceforge.net/projects/rec2s/