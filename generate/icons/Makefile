# This will create icons from font awesome

ECHO=@

FONTAWESOME_TTF=$(ROOT)/node_modules/font-awesome/fonts/fontawesome-webfont.ttf
FONTAWESOME_CSS=$(ROOT)/node_modules/font-awesome/css/font-awesome.css

ROOT=$(shell pwd)/../..
PUBLIC=$(ROOT)/public
FAVICON=$(PUBLIC)/favicon.ico
ICONS_DIR=$(PUBLIC)/icons
ONE_ICON=$(ICONS_DIR)/link-128.png

generate-icons: $(ONE_ICON) $(FAVICON)

$(FAVICON): $(ONE_ICON)
	@echo Creating favicon.ico
	$(ECHO) npx png-to-ico $(ONE_ICON) > $(FAVICON)

# iconsicon-font-to-png puts files inside an ./exported directory if given a
# relative path, so we use an absolute path $(PUBLIC) here. But
# icon-font-to-png still creates an exported folder.
$(ONE_ICON): $(FONTAWESOME_CSS) $(FONTAWESOME_TTF) createIcons.cjs
	@echo Creating icons...
	$(ECHO) node createIcons.cjs
	$(ECHO) mv *.png $(ICONS_DIR)

clean:
	@echo Cleaning
	$(ECHO) rm -f $(ICONS_DIR)/link-*.png $(FAVICON)

$(FONTAWESOME_CSS):
	@echo "Can't buid $(FONTAWESOME_CSS) - run npm install in $(ROOT)"

$(FONTAWESOME_TTF):
	@echo "Can't buid $(FONTAWESOME_TTF) - run npm install in $(ROOT)"
