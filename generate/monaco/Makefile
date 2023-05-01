ECHO=@

ROOT=$(shell pwd)/../..
PUBLIC=$(ROOT)/public
DEST=$(PUBLIC)/monaco

generate-monaco: $(DEST)

$(DEST): monaco-vite.config.js monaco.js
	@echo Building monaco
	$(ECHO) npx vite build -c monaco-vite.config.js
	$(ECHO) mkdir -p $(PUBLIC)
	$(ECHO) rm -rf $(DEST)
	$(ECHO) mv dist $(DEST)

clean:
	$(ECHO) rm -rf $(DEST)