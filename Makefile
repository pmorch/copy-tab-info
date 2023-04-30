ECHO=@

build: generate
	$(ECHO) npx vite build

dev: generate
	$(ECHO) npx vite

preview: generate
	$(ECHO) npx vite preview

release: build
	$(ECHO) cd release && node release.cjs

.PHONY: generate
generate:
	$(ECHO) $(MAKE) -C generate

lint:
	$(ECHO) npx eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore

format:
	$(ECHO) npx prettier --write src/
