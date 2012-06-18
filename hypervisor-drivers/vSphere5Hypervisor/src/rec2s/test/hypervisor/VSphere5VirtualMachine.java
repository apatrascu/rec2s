package rec2s.test.hypervisor;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

import org.json.JSONObject;

import com.sun.xml.internal.messaging.saaj.packaging.mime.internet.MimeUtility;



public class VSphere5VirtualMachine implements IVirtualMachine 
{
	public static void main(String[] args) throws Exception 
	{
		/* 
		com.vmware.vm.VMClone.main(new String[]{
				   "--url", "https://192.168.1.32/sdk",
				   "--username", "root",
				   "--password", "password",
				   "--datacentername", "ha-datacenter",
				   "--vmpath", "ha-datacenter/vm/template_002",
				   "--clonename", "Masina_"+System.currentTimeMillis()		   
				});
		*/
		/*
		if (args[0].equals("clone")) 
		{
			String lease = args[1];
			System.out.println("received lease: " + lease);
			new VSphere5VirtualMachine().clone(lease);
		}*/
		//new VSphere5VirtualMachine().move("", "");
//		new VSphere5VirtualMachine().start("");
//		TimeUnit.SECONDS.sleep(5);
//		new VSphere5VirtualMachine().pause("");
//		TimeUnit.SECONDS.sleep(5);
//		new VSphere5VirtualMachine().resume("");
//		TimeUnit.SECONDS.sleep(5);
//		new VSphere5VirtualMachine().restart("");
//		TimeUnit.SECONDS.sleep(5);
//		new VSphere5VirtualMachine().stop("");
		//String opts = args[0];
		//java -jar esx.jar clone {"params":{"hypervisorID":"ESX(i)5 v2","ip":"192.168.1.32","username":"root","password":"password","host":"localhost.localdomain"},"lease":{"leaseStartTime":1327244377269,"leaseEndTime":1327244451388,"leaseType":"URGENT","leasePreemptible":"false","minimumInstancesCount":"1","maximumInstancesCount":"1","processorArchitecture":"x86","processorVendor":"Intel","processorSpeed":"500","numberOfCores":"1","memorySize":"128","storageCapacity":"1","networkBandwidth":"100","templateName":"U_S_10_04_S"},"vappName":"1320865606716","localPath":"Dizertatie.Ubuntu.11.10.ovf","state":"PENDING"}

		//String command = "clone";
		//String opts = decode("eyJwYXJhbXMiOnsiaHlwZXJ2aXNvcklEIjoiRVNYKGkpNSIsImlwIjoiMTkyLjE2OC4xLjMyIiwidXNlcm5hbWUiOiJyb290IiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImhvc3QiOiJsb2NhbGhvc3QubG9jYWxkb21haW4ifSwibGVhc2UiOnsiY3JlZGVudGlhbHMiOnsiZGV0YWlscyI6eyJpZCI6MSwiY2VydGlmaWNhdGUiOiJhIiwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0In0sInJlcXVlc3QiOnsidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0In0sImFjY2VzcyI6ImdyYW50ZWQifSwibGVhc2UiOnsicHJvY2Vzc29yVmVuZG9yIjoiSW50ZWwiLCJuZXR3b3JrQmFuZHdpZHRoIjoiMTAwIiwibWVtb3J5U2l6ZSI6IjEyOCIsImxlYXNlU3RhcnRUaW1lIjoiIiwibGVhc2VFbmRUaW1lIjoiIiwibGVhc2VUeXBlIjoiVVJHRU5UIiwibGVhc2VQcmVlbXB0aWJsZSI6ImZhbHNlIiwibWluaW11bUluc3RhbmNlc0NvdW50IjoiMSIsInByb2Nlc3NvclNwZWVkIjoiNTAwIiwic3RvcmFnZUNhcGFjaXR5IjoiMSIsIm1heGltdW1JbnN0YW5jZXNDb3VudCI6IjEiLCJwcm9jZXNzb3JBcmNoaXRlY3R1cmUiOiJ4ODYiLCJudW1iZXJPZkNvcmVzIjoiMSIsInRlbXBsYXRlTmFtZSI6IlVfU18xMF8wNF9TIn0sImFkZGVkIjoxMzI5NDMzMDYxMzkyfSwidmFwcE5hbWUiOiIxMzI5NDMzMDYyNzAxIiwibG9jYWxQYXRoIjoiRGl6ZXJ0YXRpZS5VYnVudHUuMTEuMTAub3ZmIiwic3RhdGUiOiJTVE9QUEVEIn0=");
		String command = args[0];
		String opts = decode(args[1]);		
		if (command.equals("clone")){
			System.out.println(new VSphere5VirtualMachine().clone(opts));
		}
		if (command.equals("start")) {
			System.out.println(new VSphere5VirtualMachine().start(opts));
		}
		
	}

	private String getFullVirtualMachineTemplatePath(String virtualMachineName) throws Exception {
		Properties prop = new Properties();
		prop.load(new FileInputStream("rec2s-templates.properties"));
		return prop.getProperty(virtualMachineName);
	}
	
	@Override
	public String clone(String parameters) throws Exception {		
		JSONObject json = new JSONObject(parameters);
		JSONObject hypervisorParams = json.getJSONObject("params");
		
		String ip = hypervisorParams.getString("ip");
		String username = hypervisorParams.getString("username");
		String password = hypervisorParams.getString("password");
		String host = hypervisorParams.getString("host");
		
		//String localPath = json.getString("localPath"); //"E:/Templates.Dizertatie/002_vmware_esxi_5/Dizertatie.Ubuntu.11.10/Dizertatie.Ubuntu.11.10.ovf";
		//String vappName = getFullVirtualMachineTemplatePath(json.getString("vappName")); //"testing"+System.currentTimeMillis();
		
		String localPath = getFullVirtualMachineTemplatePath(json.getString("localPath")); //"E:/Templates.Dizertatie/002_vmware_esxi_5/Dizertatie.Ubuntu.11.10/Dizertatie.Ubuntu.11.10.ovf";
		String vappName = json.get("vappName") + ""; //"testing"+System.currentTimeMillis();
		
		/*
		String ip = "192.168.1.32";
		String username = "root";
		String password = "password";
		String host = "localhost.localdomain";
		String localPath = "E:/Templates.Dizertatie/002_vmware_esxi_5/Dizertatie.Ubuntu.11.10/Dizertatie.Ubuntu.11.10.ovf";
		String vappName = "testing"+System.currentTimeMillis();
		*/
		OvfCloner.clone(new String[]{
			"--username", username,
			"--password", password,
			"--clearIp", ip,
			"--url", "https://" + ip + "/sdk/vimService",
			"--host", host,
			"--localpath", localPath,
			"--vappname", vappName
		});		
		return "OK";
	}
	
	@Override
	public String start(String parameters) throws Exception {
		JSONObject json = new JSONObject(parameters);
		JSONObject hypervisorParams = json.getJSONObject("params");
		
		String ip = hypervisorParams.getString("ip");
		String username = hypervisorParams.getString("username");
		String password = hypervisorParams.getString("password");
		String host = hypervisorParams.getString("host");
		
		
		String localPath = getFullVirtualMachineTemplatePath(json.getString("localPath")); //"E:/Templates.Dizertatie/002_vmware_esxi_5/Dizertatie.Ubuntu.11.10/Dizertatie.Ubuntu.11.10.ovf";
		String vappName = json.get("vappName") + ""; //"testing"+System.currentTimeMillis();
		
		VirtualMachinePowerOps.main(new String[]{
				"--url", "https://" + ip + "/sdk/vimService",
				"--username", username,
				"--password", password,
				"--host", host,
				"--vmname", vappName,
				"--operation", "poweron"
			});
		
		/*
		String ip = "192.168.1.32";
		String username = "root";
		String password = "password";
		String host = "localhost.localdomain";
		String vmname = "Dizertatie.Ubuntu.11.10";
		VirtualMachinePowerOps.main(new String[]{
			"--url", "https://" + ip + "/sdk/vimService",
			"--username", username,
			"--password", password,
			"--host", host,
			"--vmname", vmname,
			"--operation", "poweron"
		});
		*/		
		return "OK";
	}
	
	@Override
	public void stop(String parameters) throws Exception {
		String ip = "192.168.1.32";
		String username = "root";
		String password = "password";
		String host = "localhost.localdomain";
		String vmname = "Dizertatie.Ubuntu.11.10";
		VirtualMachinePowerOps.main(new String[]{
			"--url", "https://" + ip + "/sdk/vimService",
			"--username", username,
			"--password", password,
			"--host", host,
			"--vmname", vmname,
			"--operation", "poweroff"
		});	
	}

	@Override
	public void restart(String parameters) throws Exception {
		stop(parameters);
		start(parameters);
	}

	@Override
	public void delete(String parameters) throws Exception {
		//TODO delete the virtual machine
	}
	
	@Override
	public void pause(String parameters) throws Exception {
		String ip = "192.168.1.32";
		String username = "root";
		String password = "password";
		String host = "localhost.localdomain";
		String vmname = "Dizertatie.Ubuntu.11.10";
		VirtualMachinePowerOps.main(new String[]{
			"--url", "https://" + ip + "/sdk/vimService",
			"--username", username,
			"--password", password,
			"--host", host,
			"--vmname", vmname,
			"--operation", "suspend"
		});	
	}
	
	@Override
	public void resume(String parameters) throws Exception {
		String ip = "192.168.1.32";
		String username = "root";
		String password = "password";
		String host = "localhost.localdomain";
		String vmname = "Dizertatie.Ubuntu.11.10";
		VirtualMachinePowerOps.main(new String[]{
			"--url", "https://" + ip + "/sdk/vimService",
			"--username", username,
			"--password", password,
			"--host", host,
			"--vmname", vmname,
			"--operation", "poweron"
		});	
	}
	
	@Override
	public void move(String sourceParameters, String destinationParameters) throws Exception {				
		//export the disk
		String exportIp = "192.168.1.32";
		String exportUsername = "root";
		String exportPassword = "password";
		String exportHost = "localhost.localdomain";
		String exportVirtualMachine = "testing1";
		String exportPath = "E:/Templates.Dizertatie/004_test";
		OvfExporterVmdk.main(new String[]{
			"--username", exportUsername,
			"--password", exportPassword,
			"--clearIp", exportIp,
			"--url", "https://" + exportIp + "/sdk/vimService",
			"--host", exportHost,
			"--vmname", exportVirtualMachine,
			"--localpath", exportPath
		});
						
		//clone the template
		String importIp = "192.168.1.32";
		String username = "root";
		String password = "password";
		String host = "localhost.localdomain";
		String localPath = "E:/Templates.Dizertatie/004_test/template.ovf";
		String vappName = "new_testing_"+System.currentTimeMillis();
		OvfCloner.clone(new String[]{
			"--username", username,
			"--password", password,
			"--clearIp", importIp,
			"--url", "https://" + importIp + "/sdk/vimService",
			"--host", host,
			"--localpath", localPath,
			"--vappname", vappName
		});		
		
		//delete temporary files		
		/*
		for (String file : new File(exportPath).list()) 
		{
			new File(file).delete();
		}
		*/
	}

 
	public static  String decode(String in) throws Exception {
		byte b[] = in.getBytes();
        ByteArrayInputStream bais = new ByteArrayInputStream(b);
        InputStream b64is = MimeUtility.decode(bais, "base64");
        byte[] tmp = new byte[b.length];
        int n = b64is.read(tmp);
        byte[] res = new byte[n];
        System.arraycopy(tmp, 0, res, 0, n);
        return new String(res);
     }  



}
