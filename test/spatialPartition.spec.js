var assert = require('assert');
var SpatialPartition = require('../dist/spatialPartition');

describe('SpatialPartition', function() {
    describe('constructor', function() {
        var grid;

        beforeEach(function() {
            grid = new SpatialPartition();
        });

        it('should have default width 100', function() {
            var actual = grid.width;
            var expected = 100;
            assert.strictEqual(actual, expected);
        });

        it('should have default height 100', function() {
            var actual = grid.height;
            var expected = 100;
            assert.strictEqual(actual, expected);
        });

        it('should have default number of X cells 10', function() {
            var actual = grid.cellWidth;
            var expected = 10;
            assert.strictEqual(actual, expected);
        });

        it('should have default number of Y cells 10', function() {
            var actual = grid.cellHeight;
            var expected = 10;
            assert.strictEqual(actual, expected);
        });

        it('should have expected cell width for custom parameters', function() {
            var testGrid = new SpatialPartition(90, 80, 3, 4);
            var expected = 30;
            var actual = testGrid.cellWidth;
            assert.strictEqual(actual, expected);
        });

        it('should have expected cell height for custom parameters', function() {
            var testGrid = new SpatialPartition(90, 80, 3, 4);
            var expected = 20;
            var actual = testGrid.cellHeight;
            assert.strictEqual(actual, expected);
        });
    });
    
    describe('add', function() {
        it('should add the new entity to the expected cell', function() {
            // test entity, on a 100x100 space partitioned unto 10x10 cells,
            // the entity will live at the grid [0, 5]
            var grid = new SpatialPartition();

            var testEntity = {
                name: 'Alice The Entity',
                x: 0,
                y: 51
            };

            grid.add(testEntity);
            var cell = grid.getCell(0, 5);
            var actual = cell[0];
            assert.equal(actual, testEntity);
        });

        it('should add the new entity to expected cell with non-default params', function() {
            // create a 90 * 80 space partitioned 3 * 4 grids
            var grid = new SpatialPartition(90, 80, 3, 4);

            // the entity should live at [1, 3]
            var testEntity = {
                name: 'Charlie The Entity',
                x: 35,
                y: 70
            };

            grid.add(testEntity);
            var cell = grid.getCell(1, 3);

            var actual = cell[0];
            assert.equal(actual, testEntity);
        });

        it('addition works custom x, y accessors', function() {
            var grid = new SpatialPartition()
                .x(function(d) {
                    return d.crazy.nesting.what;
                })
                .y(function(d) {
                    return d.why.would.you.why * 10;
                });

            // expected this to map to
            // [25, 4.5 * 10] == [25, 45] -> [2, 4]
            var testEntity = {
                name: 'Sally The Entity With Crazy Properties',
                crazy: { nesting: { what: 25} },
                why: { would: { you: { why: 4.5 } } }
            };

            grid.add(testEntity);
            var cell = grid.getCell(2, 4);

            var actual = cell[0];
            assert.equal(actual, testEntity);
        });

        it('updates the entity map as expected', function() {
            var grid = new SpatialPartition()
                .x(function(d) {
                    return d.position.x;
                })
                .y(function(d) {
                    return d.position.y;
                });

            // expect the entity to [7, 7]
            var testEntity = {
                name: 'Patel The Entity',
                position: { x: 70, y: 70 }
            };

            grid.add(testEntity);
            var actual = grid._entityMap[testEntity];
            var expected = [7, 7];
            assert.deepEqual(actual, expected);
        });
    });
});