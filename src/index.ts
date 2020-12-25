import * as CryptoJS from "crypto-js";

class Block {

    static calculateBlockHash = (
        index:number,
        previousHash:string,
        timestamp:number,
        data:string
    ): string =>
        CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

    static validateStructure = (aBlock: Block) : boolean =>
        typeof aBlock.index === "number" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string";

    public index:number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number
    ){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock:Block = new Block(0, "2020202020", "", "Hello", 123456);

let blockchain: Block[] = [genesisBlock]; //블록체인

const getBlockchain = () : Block[] => blockchain;

const getLatestBlock = () : Block => blockchain[blockchain.length -1]; //마지막 블록을 불러오는 함수

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000); //새로운 타임스탬프를 만드는 함수

const createNewBlock = (data:string) : Block => { //새블록을 만드는 함수
    const previousBlock : Block = getLatestBlock(); //이전블록 ()블록체인의 마지막 블록을 가져온다.
    const newIndex: number = previousBlock.index + 1; //이전블록 인덱스에 1을 더한 값
    const newTimestamp: number = getNewTimeStamp(); //현재 시간을 기준으로 새로운 타임스탬프를 만든다.
    const newHash: string = Block.calculateBlockHash( //해쉬계산 함수를 이용해 새로운 해쉬를 만들어낸다.
        newIndex,
        previousBlock.hash,
        newTimestamp,
        data
    );
    const newBlock : Block = new Block( //매개변수를 이용해 새로운 블록을 생성한다.
        newIndex,
        newHash,
        previousBlock.hash,
        data,
        newTimestamp
    );
    addBlock(newBlock); //정합성 검증 밑 블록체인 리스트에 블록을 추가한다.
    return newBlock;
};

    const getHashforBlock = (aBlock: Block): string => //crypto.JS에 값은 매개변수를 가지고 들어가면 같은 결과값이 나온다.
        Block.calculateBlockHash(
            aBlock.index,
            aBlock.previousHash,
            aBlock.timestamp,
            aBlock.data
        );

const isBlockValid = (
    candidateBlock: Block,
    previousBlock: Block) : boolean => { //블록에 구조가 맞는지 + 인덱스, 해쉬, 새로운 해쉬값을 체크하는 함수
    if(Block.validateStructure(candidateBlock)){ //현재 블록의 구조가 블록의 구조가 아니라면 false리턴
        return false;
    } else if(previousBlock.index + 1 !== candidateBlock.index){ //이전 블록에서 1을 더한것과 현재 블록의 인덱스가 같지 않다면 false
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) { //이전블록의 해쉬값과 현재 블록의 해쉬값이 같지 않다면 false
        return false;
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) { //같은 매개변수를 가진 해쉬값과 현재 해쉬값이 같지 않다면 false
        return false;
    } else { //위의 모든 정합성이 검증 된다면 true 리턴
        return true;
    }
};

const addBlock = (candidateBlock: Block) : void  => { //새로운 블록을 블록체인 리스트에 추가하는 함수
    if(isBlockValid(candidateBlock, getLatestBlock())){ //블록 구조가 맞는지 체크하고 이전 블록과의 인덱스, 해쉬, 새로운 해쉬값을 통과 한다면
        blockchain.push(candidateBlock); //블록체인 리스트레 현재 블록을 추가한다.
    }
}

createNewBlock("second Block")
createNewBlock("third Block")
createNewBlock("forth Block");

console.log(blockchain);
export {};