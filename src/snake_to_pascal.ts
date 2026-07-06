
import assert, { Assert } from "node:assert/strict";
import { PascalType } from "./snake_to_pascal.test";

//this needs tests real bad
//
//
//TODO: test this vile code
//
//use fp-ts and start integrating more functional programming patterns into it

const file = Bun.argv[2];


let file_lines = async () => { let fileReader = await Bun.file(file).text() };

async function getFileLines() {
    // if (Bun.argv.length <= 2) {
    //     console.log("I don't think you provided arguments. Wyd?");
    //     console.log("or something is very wrong");
    //     console.log("Usage: bun run snake_to_pascal.ts <file> <start> <end>")
    //     process.exit(1);
    // }

    //we should verify that the file array length stays the same length the entire time





    //the entire file split by newlines, should be joined by new lines
    // we'll see how reliable new lines are
    let wholeFileArray = fileReader.split("\n");
    console.log(wholeFileArray);

    let wholeFileLength = wholeFileArray.length;


    //this is the lines between starting and ending, it splits those by new lines
    // and then helps to transform them  into the final product

    const fileMarker = "//MARKER";

    let firstMarker = fileReader.indexOf("//MARKER")
    let lastMarker = fileReader.lastIndexOf("//MARKER")

    if (firstMarker === -1 || lastMarker === -1) {
        console.error("there was no markers for this file")
        process.exit(1)
    }

    let linesArg: string[] = wholeFileArray.slice(Number(firstMarker), Number(lastMarker));



    /*
        *
        *
        * writing some asserts for the starting index and ending ending index
        * would be wise because that determines what gets cut and at the
        * correct index
        *
        * for example if you had
        *
        * "lucas", "simpson", "hello"
        *  the array would be indexed as 0 1 2
        *  but the actual lines numbers are 1 2 3
        *
        *
        *  we should also anticipate some newline weirdness
        *  respective operating systems each have their own
        *  way to split lines \r \n \r\l
        *  let's build it for linux first
        *
        *
        */
    console.log("linesArg: ", linesArg);


    //This whole operation is the just the shenanigans you gotta do to uppercase a word

    let lines = pascalizeArray({ linesArray: linesArg, originalFileLength: wholeFileLength });



    let newFile = wholeFileArray.slice(0, firstMarker).concat(lines).concat(wholeFileArray.slice(lastMarker));
    //return a map of all the lines that are modified in the range



    //replace each line line at the specified key(line number) with the modified line(value)



    //write final modified file with corrected lines
    console.log("\n\n\n")
    console.log("joined array")
    console.log(wholeFileArray.join("\n"))
    console.log("\n\n\n\n")
    await Bun.write(file, wholeFileArray.join("\n"));
}


export function replaceLineWithModifiedLine(lineMap: Map<number, string>, fileArray: string[]) {
    lineMap.forEach((modifiedLine, lineNumber) => {
        fileArray[lineNumber] = modifiedLine;
    })

}
function rangeToReplacementMap(transformedLines: string[], startLine: number,
    endLine: number): Map<number, string> {

    const expected = endLine - startLine + 1;

    if (transformedLines.length !== expected) {
        console.error("there was a problem with the transformed line length ");
        console.error("The tranformed lines does not match the expected length");
        console.log("expected: ", expected);
        console.log("actual: ", transformedLines.length);

    }

    const lineMap = new Map<number, string>();


    transformedLines.forEach((value, index) => {

        lineMap.set(startLine + index, value);
    })

    return lineMap;

}


export function pascalizeArray(pascaltipo: PascalType) {
    let { linesArray } = pascaltipo;
    let lines = linesArray.map((line: string): string => {

        let trimmedString = line.trim().split("_");


        const isSupport = line.indexOf("_");


        if (isSupport === -1) {
            console.log("single word support on")
            return line.charAt(0).toUpperCase() + line.slice(1);
        }


        console.log("trimmed string", trimmedString);

        let replacedString = trimmedString.map((word) => {
            //handle all uppercase letters
            //
            let lowerword = word.toLowerCase();
            return lowerword.charAt(0).toUpperCase() + lowerword?.slice(1)
        })

        console.log("replaced string: ", replacedString);
        let joinedString = replacedString.join('_');
        joinedString = joinedString.replaceAll("_", "");

        return joinedString;
    })

    return lines;

}

if (import.meta.main) {
    getFileLines();
}
else {
    console.log(`running file: ${import.meta.file}`)
}



