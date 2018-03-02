BUILD = ../build
BOOKNAME = the-road-to-learn-react-chinese
METADATA = metadata.yaml
TOC = --toc --toc-depth=2
PAGES = ./pages

EPUB_BUILDER = pandoc

epub: $(BUILD)/$(BOOKNAME).epub

$(BUILD)/$(BOOKNAME).epub:
	mkdir -p $(BUILD)
	$(EPUB_BUILDER) -o $@ $(METADATA) `cat $(PAGES)`

clean:
	rm $(BUILD)/$(BOOKNAME).epub

.PHONY: clean epub
