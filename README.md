# Ticketing

## How to run

- first check you have Docker, Kubectl, Skaffold installed

- check you install ingress-nginx

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/cloud/deploy.yaml
```

- Add  jwt-secret to kubernetes

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

- Add the following line to your /etc/hosts file

```bash
127.0.0.1 ticketing.dev
```

- Run the following command

```bash
skaffold dev
```

- Open your browser and go to ticketing.dev

> Type `thisisunsafe` to bypass the security warning
