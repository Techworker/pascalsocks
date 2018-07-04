const operationParser = require('../../lib/BlockChain/OperationParser');

var assert = require('assert');

function getMessage(msg, isPrivate) {
    return msg.replace('$$private$$', isPrivate ? 'private ' : '');
}

describe('OperationParser', function()
{
    describe('Operation type 4 - for sale', function() {
        [true, false].forEach((a, isPrivate) => {
            it(`(private=${isPrivate}) should return a valid result`, function () {
                const forSaleOp = operationParser.parse(4,
                    getMessage('List account 12345-54 for $$private$$sale price 100.0000 PASC pay to 5678-61', isPrivate)
                );
                assert.equal('12345-54', forSaleOp.accountForSale);
                assert.equal(true, forSaleOp.amount.value.isEqualTo('100'));
                assert.equal('5678-61', forSaleOp.accountSeller);
            });

            it(`(private=${isPrivate}) should return a valid price`, function () {
                let forSaleOp = operationParser.parse(4,
                    getMessage('List account 12345-54 for $$private$$sale price 100.0000 PASC pay to 5678-61', isPrivate)
                );
                assert.equal('100.0000', forSaleOp.amount.value.toFormat(4));
                forSaleOp = operationParser.parse(4,
                    getMessage('List account 12345-54 for $$private$$sale price 100,000.0000 PASC pay to 5678-61', isPrivate)
                );
                assert.equal('100,000.0000', forSaleOp.amount.value.toFormat(4));

                forSaleOp = operationParser.parse(4,
                    getMessage('List account 12345-54 for $$private$$sale price 100,000,000.0000 PASC pay to 5678-61', isPrivate)
                );
                assert.equal('100,000,000.0000', forSaleOp.amount.value.toFormat(4));
            });

            it(`(private=${isPrivate}) should return a false if the message does not match at all`, function () {
                let forSaleOp = operationParser.parse(4,
                    getMessage('ist account 12345-54 for $$private$$sale price 100.0000 PascalCurrency pay to 5678-61', isPrivate)
                );
                assert.equal(null, forSaleOp);
            });

            it(`(private=${isPrivate}) should return a false if the forSaleAccount does not match`, function () {

                // missing checksum
                let forSaleOp = operationParser.parse(4,
                    getMessage('List account 12345 for $$private$$sale price 100.0000 PASC pay to 5678-61', isPrivate)
                );
                assert.equal(null, forSaleOp);

                // missing account no
                forSaleOp = operationParser.parse(4,
                    getMessage('List account -6 for $$private$$sale price 100.0000 PASC pay to 5678-61', isPrivate)
                );
                assert.equal(null, forSaleOp);

                // missing
                forSaleOp = operationParser.parse(4,
                    getMessage('List account for $$private$$sale price 100.0000 PASC pay to 5678-61', isPrivate)
                );
                assert.equal(null, forSaleOp);
            });

            it(`(private=${isPrivate}) should return a false if the sellerAccount does not match`, function () {

                // missing checksum
                let forSaleOp = operationParser.parse(4,
                    getMessage('List account 12345-54 for $$private$$sale price 100.0000 PASC pay to 5678', isPrivate)
                );
                assert.equal(null, forSaleOp);

                // missing account no
                forSaleOp = operationParser.parse(4,
                    getMessage('List account 12345-54 for $$private$$sale price 100.0000 PASC pay to -9', isPrivate)
                );
                assert.equal(null, forSaleOp);

                // missing
                forSaleOp = operationParser.parse(4,
                    getMessage('List account 12345-54 for $$private$$sale price 100.0000 PASC pay to', isPrivate)
                );
                assert.equal(null, forSaleOp);
            });

            it(`(private=${isPrivate}) should return a false if the price does not match`, function () {
                // missing decimals
                let forSaleOp = operationParser.parse(4,
                    getMessage('List account 12345-54 for $$private$$sale price PASC pay to 5678-61', isPrivate)
                );
                assert.equal(null, forSaleOp);
            });
        });
    });

    describe('Operation type 5 - delist for sale', function() {

        it(`should return a valid response`, function () {
            let delistForSaleOp = operationParser.parse(5, 'Delist account 12345-54 for sale');
            assert.equal('12345-54', delistForSaleOp.account);
        });

        it(`should return an invalid response`, function () {
            let delistForSaleOp = operationParser.parse(5, 'Delist account 12345 for sale');
            assert.equal(null, delistForSaleOp);

            delistForSaleOp = operationParser.parse(5, 'elist account 12345-54 for sale');
            assert.equal(null, delistForSaleOp);

            delistForSaleOp = operationParser.parse(5, 'delist account 12345-54 for sale');
            assert.equal(null, delistForSaleOp);

            delistForSaleOp = operationParser.parse(5, 'delist account -6 for sale');
            assert.equal(null, delistForSaleOp);

            delistForSaleOp = operationParser.parse(5, 'delist account for sale');
            assert.equal(null, delistForSaleOp);
        });

    });

    describe('Operation type 5 - delist for sale', function() {

        it(`should return a valid response`, function () {
            let delistForSaleOp = operationParser.parse(5, 'Delist account 12345-54 for sale');
            assert.equal('12345-54', delistForSaleOp.account);
        });

        it(`should return an invalid response`, function () {
            let delistForSaleOp = operationParser.parse(5, 'Delist account 12345 for sale');
            assert.equal(null, delistForSaleOp);

            delistForSaleOp = operationParser.parse(5, 'elist account 12345-54 for sale');
            assert.equal(null, delistForSaleOp);

            delistForSaleOp = operationParser.parse(5, 'delist account 12345-54 for sale');
            assert.equal(null, delistForSaleOp);

            delistForSaleOp = operationParser.parse(5, 'delist account -6 for sale');
            assert.equal(null, delistForSaleOp);

            delistForSaleOp = operationParser.parse(5, 'delist account for sale');
            assert.equal(null, delistForSaleOp);
        });

    });

    describe('Operation type 6 - AccountBuy account', function() {

        it(`should return a valid response`, function () {
            let buyAccountOp = operationParser.parse(6, 'AccountBuy account 12345-54 for 100.0000 PASC');
            assert.equal('12345-54', buyAccountOp.account);
            assert.equal(true, buyAccountOp.amount.value.isEqualTo('100'));
        });

        it(`should return an invalid response`, function () {
            let buyAccountOp = operationParser.parse(6, 'AccountBuy account 12345- for 100.0000 PASC');
            assert.equal(null, buyAccountOp);

            buyAccountOp = operationParser.parse(6, 'AccountBuy account -6 for 100.0000 PASC');
            assert.equal(null, buyAccountOp);

            buyAccountOp = operationParser.parse(6, 'AccountBuy account 12345-54 for PASC');
            assert.equal(null, buyAccountOp);

            buyAccountOp = operationParser.parse(6, 'delist account for sale');
            assert.equal(null, buyAccountOp);
        });

    });
});