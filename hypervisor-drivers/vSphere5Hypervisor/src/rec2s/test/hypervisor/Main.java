package rec2s.test.hypervisor;

import com.vmware.vapp.OVFManagerExportVMDK;

public class Main 
{
	public static void main(String[] args) 
	{
		//ca sa mearga trebuie sa export masina virtuala de pe ESX si s-o folosesc asa...
		String ip = "192.168.1.32";
		/*
		OvfCloner.clone(new String[]{
			"--username", "root",
			"--password", "password",
			"--clearIp", ip,
			"--url", "https://" + ip + "/sdk/vimService",
			"--host", "localhost.localdomain",
			"--localpath", "E:/Templates.Dizertatie/002_vmware_esxi_5/Dizertatie.Ubuntu.11.10/Dizertatie.Ubuntu.11.10.ovf",
			"--vappname", "testing"+System.currentTimeMillis()
		});
		*/
		/*
		//nu merge in versiunea gratis ESX :((
		OvfExporter.main(new String[]{
			"--username", "root",
			"--password", "password",
			"--clearIp", ip,
			"--url", "https://" + ip + "/sdk/vimService",
			"--host", "localhost.localdomain",
			"--vapp", "testing1323778883554",
			"--localpath", "E:\\Templates.Dizertatie\\003_vmware_esxi_export"
		});
		*/
	
		//pentru mutare:
		/*
		 * 1. export discul
		 * 2. fac un xml de tip ovf si completez sus in Resources cu numele discului, masinii virtuale si dimensiunea lui @linia 539
		 * 3. import in partea cealalta
		 * 
		 * 
		 * logul complet:
		    Getting the HTTP NFCLEASE for the VM: testing1323778883554
			HttpNfcLeaseState: READY
			########################################################
			HttpNfcLeaseInfo
			Lease Timeout: 300000000
			Total Disk capacity: 5242880
			HttpNfcLeaseDeviceUrl : 1
			   Device URL Import Key: 
			   Device URL Key: /8/VirtualLsiLogicController0:0
			   Device URL : https://-/ha-nfc/52420f1b-d76d-a710-05c1-255a9dd99744/disk-0.vmdk
			   Updated device URL: https://localhost.localdomain/ha-nfc/52420f1b-d76d-a710-05c1-255a9dd99744/disk-0.vmdk
			   SSL Thumbprint : 
			########################################################
			Downloading Files:
			Absolute File Name: disk-0.vmdk
			VMDK URL: https://192.168.1.32/ha-nfc/52420f1b-d76d-a710-05c1-255a9dd99744/disk-0.vmdk
			---------------------- Thread for Checking the HTTP NFCLEASE vmdkFlag: false----------------------
			#### TOTAL_BYTES_WRITTEN 0
			#### TOTAL_BYTES 5368709120
			Exported File testing1323778883554-disk-0.vmdk : 256764416
			Completed Downloading the files
			---------------------- Thread interrupted ----------------------
		 */
		OvfExporterVmdk.main(new String[]{
			"--username", "root",
			"--password", "password",
			"--clearIp", ip,
			"--url", "https://" + ip + "/sdk/vimService",
			"--host", "localhost.localdomain",
			"--vmname", "testing1323778883554",
			"--localpath", "E:\\Templates.Dizertatie\\003_vmware_esxi_export"
		});
		
	}
}
