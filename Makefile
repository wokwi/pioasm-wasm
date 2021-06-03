# pioasm.js
# Copyright (C) 2021, Uri Shaked
#
# To compile:
# 1. Install emscripten sdk (2.x) and set the corresponding environment variables
# 2. Install the pi-pico-sdk, and set PICO_SDK_PATH to point at it, e.g.
#    export PICO_SDK_PATH=~/pico/pico-sdk

EMCC_FLAGS = -s WASM=1 -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=callMain,FS_writeFile -O3
OBJ_FILES = CMakeFiles/pioasm.dir/main.cpp.o

all: build/pioasm.js build/pioasm-browser.js

build/pioasm.js: $(OBJ_FILES)
	emcc -o build/pioasm.js $(EMCC_FLAGS) `find build -name "*.o"`

build/pioasm-browser.js: $(OBJ_FILES) | build/pioasm.js build/browser
	emcc -o build/browser/pioasm.js $(EMCC_FLAGS) -s ENVIRONMENT=web `find build -name "*.o"`
	mv build/browser/pioasm.js build/pioasm-browser.js

clean:
	rm -rf build

CMakeFiles/pioasm.dir/main.cpp.o: build/Makefile
	cd build && emmake make

build/Makefile: build
	cd build && emcmake cmake ${PICO_SDK_PATH}/tools/pioasm

build:
	mkdir build
	echo '{"type": "commonjs"}' > build/package.json

build/browser:
	mkdir build/browser
