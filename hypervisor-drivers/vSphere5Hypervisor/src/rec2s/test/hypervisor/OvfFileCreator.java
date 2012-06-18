package rec2s.test.hypervisor;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class OvfFileCreator
{
	private String ovfFileName;
	private String hardDiskImage;
	private String hardDiskSize;
	
	public OvfFileCreator()
	{
		// TODO Auto-generated constructor stub
	}

	public void generateXML() throws Exception 
	{
		//TODO optimize this method with a StringBuilder
		
		String xmlTemplate = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Envelope vmw:buildId=\"build-441354\" xmlns=\"http://schemas.dmtf.org/ovf/envelope/1\" xmlns:cim=\"http://schemas.dmtf.org/wbem/wscim/1/common\" xmlns:ovf=\"http://schemas.dmtf.org/ovf/envelope/1\" xmlns:rasd=\"http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ResourceAllocationSettingData\" xmlns:vmw=\"http://www.vmware.com/schema/ovf\" xmlns:vssd=\"http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_VirtualSystemSettingData\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><References><File ovf:href=\"{%1}\" ovf:id=\"file1\" ovf:size=\"{%2}\" /></References><DiskSection><Info>Virtual disk information</Info><Disk ovf:capacity=\"5\" ovf:capacityAllocationUnits=\"byte * 2^30\" ovf:diskId=\"vmdisk1\" ovf:fileRef=\"file1\" ovf:format=\"http://www.vmware.com/interfaces/specifications/vmdk.html#streamOptimized\" ovf:populatedSize=\"664797184\" /></DiskSection><NetworkSection><Info>The list of logical networks</Info><Network ovf:name=\"VM Network\"><Description>The VM Network network</Description></Network></NetworkSection><VirtualSystem ovf:id=\"Dizertatie.Ubuntu.11.10\"><Info>A virtual machine</Info><Name>Dizertatie.Ubuntu.11.10</Name><OperatingSystemSection ovf:id=\"94\" vmw:osType=\"ubuntu64Guest\"><Info>The kind of installed guest operating system</Info></OperatingSystemSection><VirtualHardwareSection><Info>Virtual hardware requirements</Info><System><vssd:ElementName>Virtual Hardware Family</vssd:ElementName><vssd:InstanceID>0</vssd:InstanceID><vssd:VirtualSystemIdentifier>Dizertatie.Ubuntu.11.10</vssd:VirtualSystemIdentifier><vssd:VirtualSystemType>vmx-08</vssd:VirtualSystemType></System><Item><rasd:AllocationUnits>hertz * 10^6</rasd:AllocationUnits><rasd:Description>Number of Virtual CPUs</rasd:Description><rasd:ElementName>1 virtual CPU(s)</rasd:ElementName><rasd:InstanceID>1</rasd:InstanceID><rasd:ResourceType>3</rasd:ResourceType><rasd:VirtualQuantity>1</rasd:VirtualQuantity></Item><Item><rasd:AllocationUnits>byte * 2^20</rasd:AllocationUnits><rasd:Description>Memory Size</rasd:Description><rasd:ElementName>1024MB of memory</rasd:ElementName><rasd:InstanceID>2</rasd:InstanceID><rasd:ResourceType>4</rasd:ResourceType><rasd:VirtualQuantity>1024</rasd:VirtualQuantity></Item><Item ovf:required=\"false\"><rasd:Address>0</rasd:Address><rasd:Description>USB Controller (EHCI)</rasd:Description><rasd:ElementName>USB Controller</rasd:ElementName><rasd:InstanceID>3</rasd:InstanceID><rasd:ResourceSubType>vmware.usb.ehci</rasd:ResourceSubType><rasd:ResourceType>23</rasd:ResourceType></Item><Item><rasd:Address>0</rasd:Address><rasd:Description>SCSI Controller</rasd:Description><rasd:ElementName>SCSI Controller 0</rasd:ElementName><rasd:InstanceID>4</rasd:InstanceID><rasd:ResourceSubType>lsilogic</rasd:ResourceSubType><rasd:ResourceType>6</rasd:ResourceType></Item><Item><rasd:Address>1</rasd:Address><rasd:Description>IDE Controller</rasd:Description><rasd:ElementName>VirtualIDEController 1</rasd:ElementName><rasd:InstanceID>5</rasd:InstanceID><rasd:ResourceType>5</rasd:ResourceType></Item><Item><rasd:Address>0</rasd:Address><rasd:Description>IDE Controller</rasd:Description><rasd:ElementName>VirtualIDEController 0</rasd:ElementName><rasd:InstanceID>6</rasd:InstanceID><rasd:ResourceType>5</rasd:ResourceType></Item><Item><rasd:AddressOnParent>0</rasd:AddressOnParent><rasd:ElementName>Hard Disk 1</rasd:ElementName><rasd:HostResource>ovf:/disk/vmdisk1</rasd:HostResource><rasd:InstanceID>7</rasd:InstanceID><rasd:Parent>4</rasd:Parent><rasd:ResourceType>17</rasd:ResourceType></Item><Item ovf:required=\"false\"><rasd:AddressOnParent>0</rasd:AddressOnParent><rasd:AutomaticAllocation>false</rasd:AutomaticAllocation><rasd:ElementName>CD-ROM 1</rasd:ElementName><rasd:InstanceID>8</rasd:InstanceID><rasd:Parent>5</rasd:Parent><rasd:ResourceType>15</rasd:ResourceType></Item><Item><rasd:AddressOnParent>7</rasd:AddressOnParent><rasd:AutomaticAllocation>true</rasd:AutomaticAllocation><rasd:Connection>VM Network</rasd:Connection><rasd:Description>E1000 ethernet adapter on \"VM Network\"</rasd:Description><rasd:ElementName>Ethernet 1</rasd:ElementName><rasd:InstanceID>9</rasd:InstanceID><rasd:ResourceSubType>E1000</rasd:ResourceSubType><rasd:ResourceType>10</rasd:ResourceType></Item><Item ovf:required=\"false\"><rasd:AddressOnParent>0</rasd:AddressOnParent><rasd:AutomaticAllocation>false</rasd:AutomaticAllocation><rasd:Description>Floppy Drive</rasd:Description><rasd:ElementName>Floppy 1</rasd:ElementName><rasd:InstanceID>10</rasd:InstanceID><rasd:ResourceType>14</rasd:ResourceType></Item></VirtualHardwareSection></VirtualSystem></Envelope>";
		//{1} = the name of the vmdk hard-disk image
		//{2} = the size of the vmdk disk
		xmlTemplate = xmlTemplate.replace("{%1}", hardDiskImage);
		xmlTemplate = xmlTemplate.replace("{%2}", hardDiskSize);
		
		//write the content to a file		
		BufferedWriter out = new BufferedWriter(new FileWriter(ovfFileName));
		out.write(xmlTemplate);
		out.close();		
	}
	
	
	public String getOvfFileName()
	{
		return ovfFileName;
	}

	public void setOvfFileName(String ovfFileName)
	{
		this.ovfFileName = ovfFileName;
	}

	public String getHardDiskImage()
	{
		return hardDiskImage;
	}

	public void setHardDiskImage(String hardDiskImage)
	{
		this.hardDiskImage = hardDiskImage;
	}

	public String getHardDiskSize()
	{
		return hardDiskSize;
	}

	public void setHardDiskSize(String hardDiskSize)
	{
		this.hardDiskSize = hardDiskSize;
	}
	
	
	
	
}
