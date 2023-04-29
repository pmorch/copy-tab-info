# This will create icons from font awesome

ECHO=@

FONTAWESOME_TTF=$(ROOT)/node_modules/font-awesome/fonts/fontawesome-webfont.ttf
FONTAWESOME_CSS=$(ROOT)/node_modules/font-awesome/css/font-awesome.css
SIZES=16 32 48 64 128
FONT_COLOR=1467eb

ROOT=$(shell pwd)/../..
PUBLIC=$(ROOT)/public
FAVICON=$(PUBLIC)/favicon.ico
ONEICON=$(PUBLIC)/icons/link-128.png

generate-icons: $(ONEICON) $(FAVICON)

$(FAVICON): $(ONEICON)
	@echo Creating favicon.ico
	$(ECHO) npx png-to-ico $(ONEICON) > $(FAVICON)

# iconsicon-font-to-png puts files inside an ./exported directory if given a
# relative path, so we use an absolute path $(PUBLIC) here. But
# icon-font-to-png still creates an exported folder.
$(ONEICON): python/packages-installed $(FONTAWESOME_CSS) $(FONTAWESOME_TTF)
	$(ECHO) for size in $(SIZES) ; do \
		echo Creating icon size: $$size; \
		./python/bin/python3 icon-font-to-png/bin/icon-font-to-png \
			--css $(FONTAWESOME_CSS) \
			--ttf $(FONTAWESOME_TTF) \
			--color "#$(FONT_COLOR)" \
			--filename "$(PUBLIC)/icons/link-$$size" \
			--size $$size link; \
	done
	$(ECHO) rmdir exported

clean:
	@echo Cleaning
	$(ECHO) rm -rf python icon-font-to-png $(PUBLIC)/icons/link-*.png $(FAVICON)

$(FONTAWESOME_CSS):
	@echo "Can't buid $(FONTAWESOME_CSS) - run npm install in $(ROOT)"

$(FONTAWESOME_TTF):
	@echo "Can't buid $(FONTAWESOME_TTF) - run npm install in $(ROOT)"

python/bin:
	@echo Making python/bin
	$(ECHO) mkdir -p python
	$(ECHO) python3 -m venv python

icon-font-to-png:
	git clone https://github.com/Pythonity/icon-font-to-png

python/packages-installed: python/bin icon-font-to-png
	@echo Installing required python packages
	$(ECHO) ./python/bin/pip3 install -r icon-font-to-png/requirements.txt
	$(ECHO) touch python/packages-installed
