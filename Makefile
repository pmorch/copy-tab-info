ECHO=@

dev: generate
	$(ECHO) npx vite

test: generate
	$(ECHO) npx mocha

watch: generate
	$(ECHO) npx vite build --sourcemap true --watch

build: generate
	$(ECHO) npx vite build --sourcemap true

release: build
	$(ECHO) cd release && node release.cjs

preview: generate
	$(ECHO) npx vite preview

.PHONY: generate
generate:
	$(ECHO) $(MAKE) -C generate --no-print-directory

lint:
	$(ECHO) npx eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore

format:
	$(ECHO) npx prettier --write src/

clean:
	@echo cleaning
	$(ECHO) $(MAKE) -C generate clean
	$(ECHO) rm -rf dist
