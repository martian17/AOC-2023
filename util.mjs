// ring buffer FIFO queue
export class FIFOQueue{
    buffer = [];
    bufferSize = 1;
    size = 0;
    tail = 0;
    head = 0;
    constructor(arr=[]){
        this.buffer = [...arr];
        this.bufferSize = arr.length*2;
        this.size = arr.length;
        this.tail = arr.length;
    }
    realloc(newBufferSize){
        const buffer = this.buffer;
        this.buffer = [...buffer.slice(this.head),...buffer.slice(0,this.tail)];
        this.bufferSize = newBufferSize;
        this.tail = this.size;
        this.head = 0;
    }
    push(val){
        if(this.bufferSize < this.size+1){
            this.realloc(this.bufferSize*2);
        }
        this.buffer[this.tail] = val;
        this.tail = (this.tail+1)%this.bufferSize;
        this.size++;
    }
    pop(){
        let res = this.buffer[this.head];
        this.head = (this.head+1)%this.bufferSize;
        this.size--;
        return res;
    }
}
