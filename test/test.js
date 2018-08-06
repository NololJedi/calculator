describe("isLastSymbolOperation", function() {

    it('isLastSymbolOperation_Numbers_Fail', function() {
        assert.isFalse(isLastSymbolOperation("22233"));
    });

    it('isLastSymbolOperation_EmptyExpression_Fail', function() {
        assert.isFalse(isLastSymbolOperation(""));
    });

    it('isLastSymbolOperation_LastSymbolPlus_Success', function() {
        assert.isTrue(isLastSymbolOperation("232+"));
    });

    it('isLastSymbolOperation_LastSymbolDivide_Success', function() {
        assert.isTrue(isLastSymbolOperation("123/"));
    });

    it('isLastSymbolOperation_LastSymbolMultiple_Success', function() {
        assert.isTrue(isLastSymbolOperation("223*"));
    });

});

describe("chooseZeroForExpression", function() {

    it('chooseZeroForExpression_EmptyExpression_Success', function() {
        assert.strictEqual(chooseZeroForExpression(""), "0.");
    });

    it('chooseZeroForExpression_ExpressionEndsDigit_Success', function() {
        assert.equal(chooseZeroForExpression("10."), "0");
    });

    it('chooseZeroForExpression_ExpressionEndsPlus_Success', function() {
        assert.equal(chooseZeroForExpression("10+"), "0.");
    });

    it('chooseZeroForExpression_ExpressionEndsMinus_Success', function() {
        assert.equal(chooseZeroForExpression("10-"), "0.");
    });

    it('chooseZeroForExpression_ExpressionEndsDivide_Success', function() {
        assert.equal(chooseZeroForExpression("10/"), "0.");
    });

    it('v_ExpressionEndsMultiple_Success', function() {
        assert.equal(chooseZeroForExpression("10*"), "0");
    });

    it('chooseZeroForExpression_ExpressionEndsAnyNumber_Success', function() {
        assert.equal(chooseZeroForExpression("100"), "0");
    });

});

describe("isDigitExistInExpression", function() {

    it('isDigitExistInExpression_EmptyExpression_Success', function() {
        assert.isTrue(isDigitExistInExpression(""));
    });

    it('isDigitExistInExpression_ExpressionWithOutDigit_Success', function() {
        assert.isTrue(isDigitExistInExpression("1000"));
    });

    it('isDigitExistInExpression_ExpressionWithDigit_Fail', function() {
        assert.isFalse(isDigitExistInExpression("0.2"));
    });

});

describe("isLastSymbolDigit", function() {

    it('isLastSymbolDigit_LastSymbolDigit_Success', function() {
        assert.isTrue(isLastSymbolDigit("23."));
    });

    it('isLastSymbolDigit_ZeroWithDigit_Success', function() {
        assert.isTrue(isLastSymbolDigit("0."));
    });

});

describe("getMaxIndex", function() {

    it('getMaxIndex_Success', function() {
        assert.strictEqual(getMaxIndex(2, 1, 3, 6, 2), 6);
    });

});

describe("getLastNumber", function() {

    it('getLastNumber_LastNumberWithOutOperation_Success', function() {
        assert.strictEqual(getLastNumber("2+2-345"), "345");
    });

    it('getLastNumber_LastNumberWithOperation_Success', function() {
        assert.strictEqual(getLastNumber("2+2-345+"), "345");
    });

    it('getLastNumber_LastNumberWithDigit_Success', function() {
        assert.strictEqual(getLastNumber("2+2-345."), "345.");
    });

    it('getLastNumber_LastNumberNegativeNumber_Success', function() {
        assert.strictEqual(getLastNumber("2+2-(-345)"), "(-345)");
    });

    it('getLastNumber_LastNumberTwoNegativeNumbers_Success', function() {
        assert.strictEqual(getLastNumber("2+(-2)-(-345)"), "(-345)");
    });

    it('getLastNumber_LastNumberTwoNegativeNumbers_Success', function() {
        assert.strictEqual(getLastNumber("2+(-2)-(-345"), "(-345");
    });

    it('getLastNumber_LastNumberEmtyNegative_Success', function() {
        assert.strictEqual(getLastNumber("2+(-2)-(-)"), "(-)");
    });

});

describe("isCurrentNumberNegative", function() {

    it('isCurrentNumberNegative_NegativeNumber_Success', function() {
        assert.isTrue(isCurrentNumberNegative("2+2+(-34"));
    });

    it('isCurrentNumberNegative_Positive_Fail', function() {
        assert.isFalse(isCurrentNumberNegative("2+2-34"));
    });

});

