# compile the front end js and css
compile:
	#rm -rf node_modules
	docker build -t parking-frontend-build -f Dockercompile .
	docker rm -f parking-frontend-build &> /dev/null || true
	docker run --name parking-frontend-build parking-frontend-build
	docker cp parking-frontend-build:/data/static .
	docker rm -f parking-frontend-build

net:
	docker network ls | grep cpp-parking-net || docker network create cpp-parking-net

# build the webserver container
build: stop compile
	docker build -t parking-frontend .

# run the webserver (does not compile)
run: net
	docker run -d --net=cpp-parking-net --name=parking-frontend -p 80:80 -v `pwd`/static:/usr/share/nginx/html parking-frontend

stop:
	-docker stop parking-frontend
	-docker rm parking-frontend

# run the server and watch source files for changes
dev: stop net
	#run nginx container in the background
	docker run --name parking-frontend -d --net=cpp-parking-net -p 8000:80 -v `pwd`/static:/usr/share/nginx/html -v `pwd`/nginx-dev.conf:/etc/nginx/conf.d/default.conf parking-frontend
	#run build container
	-docker run -v `pwd`:/data --rm -it digitallyseamless/nodejs-bower-grunt:0.12 /bin/bash -c "npm install --unsafe-perm; grunt dev"
	docker stop parking-frontend
	docker rm parking-frontend
