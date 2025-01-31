/*global window, YUI, document */
/**
 * TVList is designed to focus on any item when shifting the cursor left, right, up, or down.
 *
 * @module tvlist
 * @requires base, node-base, event-key
 */
YUI.add("tvlist", function (Y) {

    var Lang           = Y.Lang,
        MODULE_ID      = "Y.TVList",
        KEY_CODE_LEFT  = 37,
        KEY_CODE_RIGHT = 39,
        KEY_CODE_UP    = 38,
        KEY_CODE_DOWN  = 40,
        KET_CODE_ENTER = 13,
        SCROLL_UP      = "up",
        SCROLL_DOWN    = "down",
        DISABLED_CLASS = "tvlist-disabled",
        DEFAULT_ACTIVE_CLASS = "focused",
        _log;

    _log = function (message, type, module) {
        type = type || "info";
        module = module || MODULE_ID;
        Y.log(message, type, module);
    };

    /**
     * TVList is designed to focus on any item when shifting the cursor left, right, up, or down.
     * The following is sample usage.
     *
     *     var tvlist = new Y.TVList({
     *         node        : "#list",   // The list node.
     *         rows        : 4,         // The amout of rows.
     *         columns     : 4,         // How many items per row contains.
     *         activeIndex : 0,         // Inex of the focused item.
     *         activeClass : "focused", // Class name of the focused item.
     *         items: [
     *              {html: '<a class="item"><h2>Title One</h2><p>Description One<p></a>', data: {title: "Title One", description: "Description One"}},
     *              {html: '<a class="item"><h2>Title Two</h2><p>Description Two<p></a>', data: {title: "Title Two", description: "Description Two"}},
     *              {html: '<a class="item"><h2>Title Three</h2><p>Description Three<p></a>', data: {title: "Title Three", description: "Description Three"}}
     *         ]
     *     });
     *
     *
     * The following is TVList html you need to have:
     *
     *     <div id="list"></div>
     *
     * TVList JavaScript will render html as below:
     *
     *     <div id="list">
     *          <div class="row clearfix">
     *               <a class="item focused">
     *                  <h2>Title One</h2>
     *                  <p>Description One</p>
     *               </a>
     *               <a class="item">
     *                  <h2>Title Two</h2>
     *                  <p>Description Two</p>
     *               </a>
     *               <a class="item">
     *                  <h2>Title Three</h2>
     *                  <p>Description Three</p>
     *               </a>
     *          </div>
     *     </div>
     *
     *
     * @constructor
     * @class TVList
     */
    function TVList () {
        TVList.superclass.constructor.apply(this, arguments);
    }

    /**
     * @property ATTRS
     */
    TVList.ATTRS = {
        /**
         * List node.
         *
         * @attribute node
         */
        "node": {
            value: null,
            writeOnce: true
        },
        /**
         * The amount of rows.
         *
         * @attribute rows
         * @type {Number}
         * @default 4
         */
        "rows": {
            value: 4,
            validator: Lang.isNumber,
            writeOnce: true
        },
        /**
         * How many items per row contains.
         *
         * @attribute columns
         * @type {Number}
         * @default 4
         */
        "columns": {
            value: 4,
            validator: Lang.isNumber,
            writeOnce: true
        },
        /**
         * Which item is focused.
         *
         * @attribute activeIndex
         * @type {Number}
         * @default 0
         */
        "activeIndex": {
            value: 0,
            validator: Lang.isNumber,
            setter: function (activeIndex) {
                var that = this;
                that._render(activeIndex);
            }
        },
        /**
         * Which item is focused.
         *
         * @attribute activeClass
         * @type {String}
         * @default DEFAULT_ACTIVE_CLASS
         */
        "activeClass": {
            value: DEFAULT_ACTIVE_CLASS,
            validator: Lang.isString,
            writeOnce: true
        },
        /**
         * An array to store all items.
         *
         * @attribute items
         * @type {Array}
         * @default []
         */
        "items": {
            value: [],
            validator: Lang.isArray,
            writeOnce: true
        },
        /**
         * Disable or enable events active.
         * Prevent to trigger tvlist events if any node binds the same event.
         *
         * @attribute disabled
         * @type {Boolean}
         * @default false
         */
        "disabled": {
            value: false,
            validator: Lang.isBoolean,
            setter: function (isDisabled) {
                var that = this,
                    node = that.get("node");
                if (isDisabled) {
                    node.addClass(DISABLED_CLASS);
                } else {
                    node.removeClass(DISABLED_CLASS);
                }
            }
        }
    };

    Y.extend(TVList, Y.Base, {
        _cursorX: 0,
        _cursorY: 0,
        _topRow: 0,
        /**
         * Move x and y of the cursor.
         *
         * @method _handleMove
         * @private
         * @param e {Y.Event} The event instance
         * @param cursor {Object} cursor.x shifting left/right; -1 for left, 1 for right. cursor.y shifting up/down; -1 for up, 1 for down.
         * @return void
         */
        _handleMove: function (e, cursor) {
            _log("_handleMove() is executed.");

            var that  = this,
                x     = cursor.x,
                y     = cursor.y,
                rows      = 0,
                columns   = 0,
                activeIndex = 0,
                totalItems  = 0;

            if (that.get("disabled")) {
                return;
            }

            activeIndex = that._getIndexInAll();
            rows        = that.get("rows");
            columns     = that.get("columns");
            totalItems  = that.get("items").length;

            if (columns > 1 && !that._getMoving(x, y)) {
                return;
            }

            if (columns <= 1) { // Single column
                if (activeIndex < columns && y === -1) { // Top and up
                    activeIndex = totalItems - 1;
                    that._render(activeIndex);
                } else if (activeIndex > totalItems - columns - 1 && y === 1) { // Bottom and down
                    activeIndex = 0;
                    that._render(activeIndex);
                } else {
                    that._resetFocus();
                    that._cursorY += y;
                    if (that._cursorY < 0) {
                        that._cursorY = 0;
                        that._scroll(SCROLL_DOWN);
                    }
                    if (that._cursorY >= rows - 1) {
                        that._cursorY = rows - 2;
                        that._scroll(SCROLL_UP);
                    }
                    that._setFocus();
                }
            } else {
                if (activeIndex === 0 && x === -1) { // First and left
                    activeIndex = totalItems - 1;
                    that._render(activeIndex);
                } else if (activeIndex === totalItems - 1 && x === 1) { // Last and right
                    activeIndex = 0;
                    that._render(activeIndex);
                } else {
                    that._resetFocus();
                    that._cursorX += x;
                    if (that._cursorX >= columns) {
                        that._cursorX = 0;
                        that._cursorY += 1;
                    }
                    if (that._cursorX < 0) {
                        that._cursorX = columns - 1;
                        that._cursorY -= 1;
                    }
                    if (rows > 1) { // Not single row
                        that._cursorY += y;
                        if (that._cursorY < 0) {
                            that._cursorY = 0;
                            that._scroll(SCROLL_DOWN);
                        }
                        if (that._cursorY >= rows - 1) {
                            that._cursorY = rows - 2;
                            that._scroll(SCROLL_UP);
                        }
                    }
                    that._setFocus();
                }
            }

            that.fire("move", {
                activeIndex: that._getIndexInAll()
            });
        },
        /**
         * Handles when selecting any item.
         *
         * @event _handleEnter
         * @private
         * @param e {Y.Event} The event instance
         * @return void
         */
        _handleEnter: function (e) {
            _log("_handleEnter() is executed.");

            var that   = this,
                activeIndex = that._getIndexInAll();
            if (that.get("disabled")) {
                return;
            }

            that.fire("enter", {
                data   : that.get("items")[activeIndex].data,
                offset : that._getIndexInPage()
            });
        },
        /**
         * Render and append html.
         *
         * @property _render
         * @private
         * @param activeIndex {Number} Index of the focused item.
         * @return void
         */
        _render: function (activeIndex) {
            _log("_render() is executed.");

            var that   = this,
                html   = [],
                rows   = 0,
                columns = 0,
                totalRows = 0,
                index,
                items,
                node,
                i;

            that._remove();

            node    = that.get("node");
            rows    = that.get("rows");
            columns = that.get("columns");
            items   = that.get("items");
            that._cursorX = activeIndex % columns;
            that._topRow  = Math.floor(activeIndex / columns);
            totalRows     = Math.ceil(items.length / columns);

            if ((rows > 1) && (that._topRow + rows >= totalRows)) {
                if (Math.floor(activeIndex / columns) === totalRows -1) { // The last row
                    that._topRow = totalRows - rows + 1;
                } else {
                    that._topRow = totalRows - rows;
                }
                if (that._topRow < 0) {
                    that._topRow = 0;
                }
                that._cursorY = Math.floor(activeIndex / columns) - that._topRow;
            } else {
                that._cursorY = 0;
            }

            for (i=0; i<rows*columns; i++) {
                if (i % columns === 0) {
                    if (i !== 0) {
                        html.push("</div>");
                    }
                    html.push('<div class="row clearfix">');
                }
                index = that._topRow * columns + i;
                if (items[index] && items[index].html) {
                    html.push(items[index].html);
                }
            }
            html.push("</div>");
            node.append(html.join(""));

            that._setFocus();
        },
        /**
         * Remove all list nodes in viewable page.
         *
         * @method _remove
         * @private
         * @return void
         */
        _remove: function () {
            _log("_remove() is executed.");

            var that     = this,
                rowNodes = that.get("node").all(".row");
            Y.each(rowNodes, function (rowNode, i) {
                rowNode.remove();
            });
        },
        /**
         * Get boolean value.
         *
         * @method _getMoving
         * @private
         * @param x {Number}
         * @param y {Number}
         * @return isMoving {Boolean}
         */
        _getMoving: function (x, y) {
            _log("_getMoving() is executed.");

            var that        = this,
                columns     = that.get("columns"),
                totalItems  = that.get("items").length,
                isMoving    = true,
                activeIndex = that._getIndexInAll();

            if ((activeIndex < columns && y === -1) // Top and up
                || (activeIndex > totalItems - columns - 1 && y === 1)) { // Bottom and down
                isMoving = false;
            }
            return isMoving;
        },
        /**
         * Get index of the focused item in items array.
         *
         * @method _getIndexInAll
         * @private
         * @return {Number}
         */
        _getIndexInAll: function () {
            _log("_getIndexInAll() is executed.");

            var that    = this,
                columns = that.get("columns");
            return (that._topRow + that._cursorY) * columns + that._cursorX;
        },
        /**
         * Get index of the focused item in the viewable page.
         *
         * @method _getIndexInPage
         * @private
         * @return {Number}
         */
        _getIndexInPage: function () {
            _log("_getIndexInPage() is executed.");

            var that    = this,
                columns = that.get("columns");
            return that._cursorY * columns + that._cursorX;
        },
        /**
         * Get boolean if the last row is visible and accessible.
         *
         * @method _getAtBottom
         * @private
         * @return {Boolean}
         */
        _getAtBottom: function () {
            _log("_getAtBottom() is executed.");

            var that       = this,
                rows       = that.get("rows"),
                columns    = that.get("columns"),
                totalItems = that.get("items").length;

            return that._topRow > Math.ceil(totalItems / columns) - rows + 1;
        },
        /**
         * Reset focused class.
         *
         * @method _resetFocus
         * @private
         * @return void
         */
        _resetFocus: function () {
            _log("_resetFocus() is executed.");

            var that = this,
                index,
                node,
                itemNode;

            node  = that.get("node");
            index = that._getIndexInPage();
            itemNode = node.all(".item").item(index);
            if (itemNode) {
                itemNode.removeClass(that.get("activeClass"));
            }
        },
        /**
         * Set focused class.
         *
         * @method _setFocus
         * @private
         * @return void
         */
        _setFocus: function () {
            _log("_setFocus() is executed.");

            var that = this,
                index,
                node,
                itemNode;

            node  = that.get("node");
            index = that._getIndexInPage();
            itemNode = node.all(".item").item(index);
            if (itemNode) {
                itemNode.addClass(that.get("activeClass"));
            }
        },
        /**
         * Scroll the tvlist.
         *
         * @method _scroll
         * @private
         * @param direction {String}
         * @return void
         */
        _scroll: function (direction) {
            _log("_scroll() is executed.");

            var that = this,
                rows,
                columns,
                node,
                rowNodes,
                totalItems,
                offset,
                html;

            rows       = that.get("rows");
            columns    = that.get("columns");
            node       = that.get("node");
            rowNodes   = node.all(".row");
            totalItems = that.get("items").length;

            switch (direction) {
                case SCROLL_UP: // Scroll items up.
                    if (that._getAtBottom()) {
                        that._topRow = Math.ceil(totalItems / columns) - rows + 1;
                        that._setFocus();
                    } else {
                        rowNodes.item(0).remove();
                        that._topRow +=1;
                        offset = columns * (rows - 1);
                        html   = that._createRow(offset);
                        node.append(html);
                    }
                    break;
                case SCROLL_DOWN: // Scroll items down.
                    if (that._topRow <= 0) {
                        that._topRow = 0;
                        that._setFocus();
                    } else {
                        rowNodes.item(rows - 1).remove();
                        that._topRow -= 1;
                        offset = 0;
                        html   = that._createRow(offset);
                        node.prepend(html);
                    }
                    break;
            }
        },
        /**
         * Create the row of the tvlist.
         *
         * @method _createRow
         * @private
         * @param offset {Number} Index in page of first item in created row.
         * @return html {String} HTML string of the tvlist row.
         */
        _createRow: function (offset) {
            _log("_createRow() is executed.");

            var that    = this,
                columns = that.get("columns"),
                items   = that.get("items"),
                html    = [],
                index,
                i;

            html.push('<div class="row clearfix">');
            for (i=0; i<columns; i++) {
                index = that._topRow * columns + offset + i;
                if (items[index] && items[index].html) {
                    html.push(items[index].html);

                }
            }
            html.push("</div>");
            return html.join("");
        },
        /**
         * Parse data attributes of each item node.
         *
         * @method _parseAttrs
         * @private
         * @param node {Y.Node} Item node.
         * @return data {Object} Data attributes of each item node.
         */
        _parseAttrs: function (node) {
            _log("_parseAttrs() is executed.");

            var attributes = node._node.attributes,
                data = {};
            Y.each(attributes, function (attr, i) {
                var key = attr.nodeName.toLowerCase();
                if (key.search("data-") !== -1) {
                    data[key] = node._node.getAttribute(key);
                }
            });
            return data;
        },
        /**
         * destructor is part of the lifecycle introduced by
         * the Base class. It is invoked when destroy() is called,
         * and can be used to cleanup instance specific state.
         *
         * @method destructor
         * @public
         */
        destructor: function () {
            _log("destructor() is executed.");
        },
        /**
         * Initialize TVList instance.
         * initializer is part of the lifecycle introduced by
         * the Base class. It is invoked during construction,
         * and can be used to setup instance specific state or publish events which
         * require special configuration (if they don't need custom configuration,
         * events are published lazily only if there are subscribers).
         *
         * @method initializer
         * @public
         */
        initializer: function (config) {
            _log("initializer() is executed");
            var that     = this,
                bodyNode = Y.one("body"),
                node,
                itemNodes,
                items = [];

            // Extend key codes.
            Y.Node.DOM_EVENTS.key.eventDef.KEY_MAP.arrowleft  = KEY_CODE_LEFT;
            Y.Node.DOM_EVENTS.key.eventDef.KEY_MAP.arrowright = KEY_CODE_RIGHT;
            Y.Node.DOM_EVENTS.key.eventDef.KEY_MAP.arrowup    = KEY_CODE_UP;
            Y.Node.DOM_EVENTS.key.eventDef.KEY_MAP.arrowdown  = KEY_CODE_DOWN;
            Y.Node.DOM_EVENTS.key.eventDef.KEY_MAP.enter      = KET_CODE_ENTER;
            // Set node.
            node = config.node;
            if (Lang.isString(node)) {
                node = Y.one(node);
            }
            that._set("node", node);

            // Set disabled.
            that.set("disabled", that.get("disabled"));

            // Parse classname ".item" of all nodes, and their data attributes.
            if (Lang.isUndefined(config.items)) {
                itemNodes = node.all(".item");
                if (itemNodes.size()) {
                    Y.each(itemNodes, function (itemNode, i) {
                        items.push({
                            html: itemNode._node.outerHTML,
                            data: that._parseAttrs(itemNode)
                        });
                    });
                    that._set("items", items);
                }
            }

            if (that.get("items").length) {
                that.set("activeIndex", config.activeIndex);
                // Bind events.
                if (that.get("rows") > 1) {
                    bodyNode.on("key", that._handleMove, "down:arrowup", that, {x: 0, y: -1});
                    bodyNode.on("key", that._handleMove, "down:arrowdown", that, {x: 0, y: 1});
                }
                if (that.get("columns") > 1) {
                    bodyNode.on("key", that._handleMove, "down:arrowleft", that, {x: -1, y: 0});
                    bodyNode.on("key", that._handleMove, "down:arrowright", that, {x: 1, y: 0});
                }
                bodyNode.on("key", that._handleEnter, "down:enter", that);
            }
        }
    });

    // Promote to YUI environment.
    Y.TVList = TVList;

}, "0.0.1", {"requires": ["base", "node-base", "event-key"]});
