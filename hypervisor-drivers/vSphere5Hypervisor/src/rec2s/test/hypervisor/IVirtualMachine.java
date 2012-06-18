package rec2s.test.hypervisor;


/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2011 Alecsandru Patrascu
 * Computer Science Dept, Distributed Systems Lab
 * University Politehnica of Bucharest, Romania
 *
 */


public interface IVirtualMachine
{
	//intoarce un String serializat json cu proprietatile noii masini virtuale 
	//primeste un String serializat json cu proprietatile care se vor face
    
    public String clone(String parameters) throws Exception;
    
    public String start(String parameters) throws Exception;
    
    public void stop(String parameters) throws Exception;
    
    public void restart(String parameters) throws Exception;
    
    public void delete(String parameters) throws Exception;    
    
    public void pause(String parameters) throws Exception;
    
    public void resume(String parameters) throws Exception;
    
    public void move(String parameters, String destinationParameters) throws Exception;
}

