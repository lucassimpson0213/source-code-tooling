

import type { PascalType } from "./snake_to_pascal.test";

import type { BunFile } from "bun";

const file = Bun.argv[2];


class FileTransformer {
    private readonly filePath: string;
    private fileHandle: BunFile | null;
    private readonly rawFileLines: string[] | null = null;
    constructor(private readonly filepath: string) {
        this.filePath = filepath;
        this.fileHandle = null;
        this.rawFileLines = null;
    }
    // use io at the boundries don't do io in class methods use them to encapsulate state
    // use const as much as possible
    private async init_file(filepath: string) {
        this.fileHandle = Bun.file(this.filepath);
    }

    public async fromFile() {
        if (this.fileHandle === null) {
            this.fileHandle = Bun.file(this.filepath)
        }

    }
}


// **Design Notes**

// * Use rich abstractions to hide complexity and make intent obvious.
// * Use pure functions to simplify reasoning and testing.
// * Keep I/O and side effects at the boundaries.
// * Let classes earn their existence by owning meaningful state or behavior.




async function parseFileLines(fileLines: string) {

    let wholeFileArray = fileLines.split("\n");
    console.log(wholeFileArray);

    let wholeFileLength = wholeFileArray.length;





    const fileMarker = "//MARKER";

    let firstMarker = fileLines.indexOf("//MARKER")
    let lastMarker = fileLines.lastIndexOf("//MARKER")

    if (firstMarker === -1 || lastMarker === -1) {
        console.error("there was no markers for this file")
        process.exit(1)
    }

    let linesArg: string[] = wholeFileArray.slice(Number(firstMarker), Number(lastMarker));


    let lines = pascalizeArray({ linesArray: linesArg, originalFileLength: wholeFileLength });



    let newFile = wholeFileArray.slice(0, firstMarker).concat(lines).concat(wholeFileArray.slice(lastMarker));
    //write final modified file with corrected lines
    console.log("\n\n\n")
    console.log("joined array")
    console.log(wholeFileArray.join("\n"))
    console.log("\n\n\n\n")
    await Bun.write(file, wholeFileArray.join("\n"));
}




if (import.meta.main) {
    getFileLines();
}
else {
    console.log(`running file: ${import.meta.file}`)
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


