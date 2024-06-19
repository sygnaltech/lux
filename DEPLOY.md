
Coding;

- Code on dev branch only

https://dev.luxradiology.co.nz

Testing; 

- Commit changes to dev 
- Builds and deploys to test on Netlify (10 sec)

- ~Merge dev to test~

https://test.luxradiology.co.nz

https://app.netlify.com/sites/lux-radiology-test/deploys

Prod;

- Deploy test branch to main

https://www.luxradiology.co.nz

https://app.netlify.com/sites/lux-radiology/deploys


# Setup

## package.json

Edit name and version

## index.ts

Edit `SITE_NAME` and `VERSION`. 


## Integration

Site-wide - before HTML

Replace REPO, handle as desired

```
<!-- Site engine -->
<script 
  src="https://cdn.jsdelivr.net/gh/sygnaltech/REPO@0.1.0/dist/init.js" 
  dev-src="http://127.0.0.1:3000/dist/index.js"
  ></script>
```

```
<!-- Site engine -->
<script 
  src="https://cdn.jsdelivr.net/gh/sygnaltech/REPO@0.1.0/dist/index.js" 
  dev-src="http://127.0.0.1:3000/dist/index.js"
  ></script>
```

```
<!-- Site engine -->
<script 
  src="http://127.0.0.1:3000/dist/init.js" 
  dev-src="http://127.0.0.1:3000/dist/index.js"
  ></script>
```