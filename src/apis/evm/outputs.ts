/**
 * @packageDocumentation
 * @module API-EVM-Outputs
 */

import { Buffer } from 'buffer/';
import BN from 'bn.js';
import BinTools from '../../utils/bintools';

/**
 * @ignore
 */
const bintools = BinTools.getInstance();

/**
 * Takes a buffer representing the output and returns the proper Output instance.
 *
 * @returns An instance of an [[EVMOutput]] class.
 */
export const SelectOutputClass = (...args: any[]): EVMOutput => {
  return new EVMOutput( ...args);
}

export class EVMOutput {
  protected address: Buffer = Buffer.alloc(20); 
  protected amount: Buffer = Buffer.alloc(8);
  protected amountValue: BN = new BN(0);
  protected assetid: Buffer = Buffer.alloc(32);

  /**
   * Returns the address of the input as {@link https://github.com/feross/buffer|Buffer}
   */
  getAddress = (): Buffer => this.address;

  /**
   * Returns the amount as a {@link https://github.com/indutny/bn.js/|BN}.
   */
  getAmount = (): BN => this.amountValue.clone();

  /**
   * Returns the assetid of the input as {@link https://github.com/feross/buffer|Buffer}
   */ 
  getAssetID = (): Buffer => this.assetid;
 
  /**
   * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[EVMOutput]].
   */
  toBuffer():Buffer {
    const bsize: number = this.address.length + this.amount.length + this.assetid.length;
    const barr: Buffer[] = [this.address, this.amount, this.assetid];
    const buff: Buffer = Buffer.concat(barr, bsize);
    return buff;
  }

  /**
   * Decodes the [[EVMOutput]] as a {@link https://github.com/feross/buffer|Buffer} and returns the size.
   */
  fromBuffer(bytes: Buffer, offset: number = 0): number {
    this.address = bintools.copyFrom(bytes, offset, offset + 20);
    offset += 20;
    this.amount = bintools.copyFrom(bytes, offset, offset + 8);
    offset += 8;
    this.assetid = bintools.copyFrom(bytes, offset, offset + 32);
    offset += 32;
    return offset;
  }

  /**
   * Returns a base-58 representation of the [[EVMOutput]].
   */
  toString():string {
    return bintools.bufferToB58(this.toBuffer());
  }

  /**
   * An [[EVMOutput]] class which contains address, amount, and assetID.
   *
   * @param address The address recieving the asset as a {@link https://github.com/feross/buffer|Buffer} or a string.
   * @param amount A {@link https://github.com/indutny/bn.js/|BN} representing the amount.
   * @param assetid The asset id which is being sent as a {@link https://github.com/feross/buffer|Buffer}
   */
  constructor(
    address: Buffer | string = undefined, 
    amount: BN | number = undefined, 
    assetid: Buffer | string = undefined
  ) {
    if (typeof address !== undefined && typeof amount !== undefined && typeof assetid !== undefined) {
      // convert string address to Buffer
      if(!(address instanceof Buffer)) {
        address = bintools.stringToAddress(address);
      }

      // convert number amount to BN
      let amnt:BN;
      if (typeof amount === 'number') {
        amnt = new BN(amount);
      } else {
        amnt = amount;
      }

      // convert string assetid to Buffer
      if(!(assetid instanceof Buffer)) {
        assetid = bintools.cb58Decode(assetid);
      }

      this.address = address;
      this.amountValue = amnt.clone();
      this.amount = bintools.fromBNToBuffer(amnt, 8);
      this.assetid = assetid;
    }
  }
}  