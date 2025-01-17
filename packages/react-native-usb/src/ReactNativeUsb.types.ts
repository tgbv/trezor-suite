// TODO: implement these properties, because they are part of WebUSB specs, but very low priority we are not using them anywhere
type USBConfiguration = any;
type USBControlTransferParameters = any;
type USBInTransferResult = any;
type USBOutTransferResult = any;
type USBDirection = any;
type USBIsochronousInTransferResult = any;
type USBIsochronousOutTransferResult = any;

export interface NativeDevice {
    // TODO: implement commented out properties, because they are part of WebUSB specs, but very low priority we are not using them anywhere

    // readonly usbVersionMajor: number;
    // readonly usbVersionMinor: number;
    // readonly usbVersionSubminor: number;
    readonly deviceClass: number;
    readonly deviceSubclass: number;
    readonly deviceProtocol: number;
    readonly vendorId: number;
    readonly productId: number;
    // readonly deviceVersionMajor: number;
    // readonly deviceVersionMinor: number;
    // readonly deviceVersionSubminor: number;
    readonly manufacturerName?: string | undefined;
    readonly productName?: string | undefined;
    readonly serialNumber?: string | undefined;
    // readonly configuration?: USBConfiguration | undefined;
    // readonly configurations: USBConfiguration[];
    readonly opened: boolean;

    // extra properties that are not part of WebUSB specs
    readonly deviceName: string;
}

export interface WebUSBDevice {
    readonly usbVersionMajor: number;
    readonly usbVersionMinor: number;
    readonly usbVersionSubminor: number;
    readonly deviceClass: number;
    readonly deviceSubclass: number;
    readonly deviceProtocol: number;
    readonly vendorId: number;
    readonly productId: number;
    readonly deviceVersionMajor: number;
    readonly deviceVersionMinor: number;
    readonly deviceVersionSubminor: number;
    readonly manufacturerName?: string | undefined;
    readonly productName?: string | undefined;
    readonly serialNumber?: string | undefined;
    readonly configuration?: USBConfiguration | undefined;
    readonly configurations: USBConfiguration[];
    readonly opened: boolean;
    open(): Promise<void>;
    close(): Promise<void>;
    forget(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    releaseInterface(interfaceNumber: number): Promise<void>;
    selectAlternateInterface(interfaceNumber: number, alternateSetting: number): Promise<void>;
    controlTransferIn(
        setup: USBControlTransferParameters,
        length: number,
    ): Promise<USBInTransferResult>;
    controlTransferOut(
        setup: USBControlTransferParameters,
        data?: BufferSource,
    ): Promise<USBOutTransferResult>;
    clearHalt(direction: USBDirection, endpointNumber: number): Promise<void>;
    transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
    transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
    isochronousTransferIn(
        endpointNumber: number,
        packetLengths: number[],
    ): Promise<USBIsochronousInTransferResult>;
    isochronousTransferOut(
        endpointNumber: number,
        data: BufferSource,
        packetLengths: number[],
    ): Promise<USBIsochronousOutTransferResult>;
    reset(): Promise<void>;
}

export interface OnConnectEvent extends Event {
    device: WebUSBDevice;
}
