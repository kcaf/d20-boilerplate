# Description
Roll20 userscript boilerplate.  
Bypass Content Security Policy and gain access to d20 object.

## Why?
For a while now, I've been wanting to tinker with a Roll20 userscript. I soon realized there were a couple of obstacles to overcome for this project. First, the Content Security Policy is very restrictive. Simple enough, we can eval our code within the unsafeWindow. Second, the main object, d20, is not accessible from the outside. To gain access, we have to wait until d20ext is created and override the setting of the environment property to development. A third issue is that development triggers a series of other changes that impede gameplay. As soon as the d20 object is exposed, we set everything back to production and cleanly back out. Now we have our code running on Roll20 with the d20 object exposed and it's all nice and clean :)
