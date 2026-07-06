import { test, expect, describe } from 'bun:test'

import { replaceLineWithModifiedLine, pascalizeArray } from './snake_to_pascal'


type TestFuncParams = string | string[]
type TestFunction<A, B> = (funcParam: A) => B;
type TestCase<Input, Output> = {
    name: string,
    input: string[] | string | PascalType,
    expected: string[] | string,
    type: TestType,
    testFunction: TestFunction<Input, Output>
}

enum TestType {
    Normal,
    EdgeCase,
    WeirdCase
}

export type PascalType = {
    linesArray: string[],
    originalFileLength: number
}
const pascalizetestCases: TestCase<PascalType, string[]>[] = [
    {
        name: "pascalizes simple snake_case string in array",
        input: ["hello_happy"],
        expected: ["HelloHappy"],
        type: TestType.Normal,
        testFunction: pascalizeArray,
    },
    {
        name: "pascalizes multiple snake_case strings",
        input: ["hello_world", "good_morning", "rust_lang"],
        expected: ["HelloWorld", "GoodMorning", "RustLang"],
        type: TestType.Normal,
        testFunction: pascalizeArray,
    },
    {
        name: "handles already lowercase single word",
        input: ["hello"],
        expected: ["Hello"],
        type: TestType.Normal,
        testFunction: pascalizeArray,
    },
    {
        name: "handles already PascalCase word",
        input: ["HelloWorld"],
        expected: ["HelloWorld"],
        type: TestType.Normal,
        testFunction: pascalizeArray,
    },
    {
        name: "handles empty array",
        input: [],
        expected: [],
        type: TestType.Normal,
        testFunction: pascalizeArray,
    },
    {
        name: "handles string with many underscores",
        input: ["this_is_a_long_variable_name"],
        expected: ["ThisIsALongVariableName"],
        type: TestType.Normal,
        testFunction: pascalizeArray,
    },
    {
        name: "handles uppercase snake case",
        input: ["HELLO_WORLD"],
        expected: ["HelloWorld"],
        type: TestType.Normal,
        testFunction: pascalizeArray,
    },
    {
        name: "handles mixed case snake case",
        input: ["hELLo_wORLd"],
        expected: ["HelloWorld"],
        type: TestType.EdgeCase,
        testFunction: pascalizeArray,
    },
    {
        name: "handles leading underscore",
        input: ["_hello_world"],
        expected: ["HelloWorld"],
        type: TestType.EdgeCase,
        testFunction: pascalizeArray,
    },
    {
        name: "handles trailing underscore",
        input: ["hello_world_"],
        expected: ["HelloWorld"],
        type: TestType.EdgeCase,
        testFunction: pascalizeArray,
    },
    {
        name: "handles repeated underscores",
        input: ["hello__world"],
        expected: ["HelloWorld"],
        type: TestType.EdgeCase,
        testFunction: pascalizeArray,
    },
    {
        name: "handles numbers inside words",
        input: ["user_123_name"],
        expected: ["User123Name"],
        type: TestType.EdgeCase,
        testFunction: pascalizeArray,
    },

];




describe("testing file line by line replacement", () => {
    let amountOfNormalCases = 0;
    let amountOfEdgeCases = 0;
    let typeOfCase = Bun.env.TEST_CASE ?? "Normal";
    for (let { name, input, expected, type } of pascalizetestCases) {
        if (typeOfCase === "Normal" && type === TestType.Normal) {
            amountOfNormalCases++;

            test(name, () => {
                let actual = pascalizeArray({ linesArray: input as string[], originalFileLength: 1 });
                expect(actual).toEqual(expected as string[]);
            })
        }
        else if (typeOfCase === "EdgeCase" && type === TestType.EdgeCase) {
            amountOfEdgeCases++;



            test(name, () => {
                let actual = pascalizeArray({ linesArray: input as string[], originalFileLength: 0 } as PascalType);
                expect(actual).toEqual(expected as string[])
            })
        }
    }

    let total = pascalizetestCases.length;

    if (typeOfCase == "EdgeCase") {
        console.log(`ran ${total - amountOfNormalCases} edge case tests out of ${total} tests`);

    }
    if (typeOfCase == "Normal") {
        console.log(`ran ${total - amountOfEdgeCases} normal tests out of ${total} tests`);
    }

})


describe("test actual line replacement given a file map", () => {

})



