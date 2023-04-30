ECHO=@

ROOT=$(shell pwd)/../..
PUBLIC=$(ROOT)/public
SRC=$(ROOT)/src
SCHEMA=$(PUBLIC)/configSchema.yaml

DEST_JS=$(ROOT)/src/generated-code/config-schema-validate.js

generate-schema-validator: $(DEST_JS)

$(DEST_JS): $(SCHEMA) compile-jtd-schema.js
	@echo Generating schema validator
	$(ECHO) node compile-jtd-schema.js $(SCHEMA) > $(DEST_JS)

clean:
	rm -f $(DEST_JS)

