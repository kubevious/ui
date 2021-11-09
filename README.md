# Kubevious Frontend 
**Kubevious** brings clarity and safety to Kubernetes. Kubevious renders all configurations relevant to the application in one place. That saves a lot of time from operators, enforcing best practices, eliminating the need for looking up settings and digging within selectors and labels.

**Frontend** is only one of the components required by Kubevious. Learn more about [Kubevious architecture here](https://github.com/kubevious/kubevious/blob/master/ARCHITECTURE.md).
![Kubevious High-Level Architecture](https://github.com/kubevious/kubevious/blob/master/diagrams/high-level-architecture.png?raw=true)


## Local Setup and Development
```sh
# Install NPM dependencies
$ npm install

# Run Kubevious Backend
$ ./run-dev.sh
```

Make sure to also run the **[Backend](https://github.com/kubevious/backend#local-setup-and-development)** and **[Parser](https://github.com/kubevious/parser#local-setup-and-development)** components.

Application will be available from [http://localhost:4000](http://localhost:4000)