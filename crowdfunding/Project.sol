pragma solidity ^0.4.17;

contract ProjectFactory{
    address[] public deployedProjects;
    address public factoryManager;
    function ProjectFactory() public {
        factoryManager = msg.sender;
    }
    function createProject(uint minimum) public {
        address newProject = new Project(minimum, msg.sender, factoryManager);
        deployedProjects.push(newProject);
    }
    function getProjects() public view returns (address[]){
        return deployedProjects;
    }
}
contract Project{
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
        bool critical_approve;
    }
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    address public critical_approver;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    function Project(uint minimum, address creator, address third_person) public {
        manager = creator;
        minimumContribution = minimum;
        critical_approver = third_person;
    }
    function contribute() public payable{
        require(msg.value > minimumContribution); 
        approvers[msg.sender] = true;
        approversCount++;
    }
    function createRequest(string description, uint value, address recipient) public restricted{
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0,
            critical_approve: false
        });
        requests.push(newRequest);
    }
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    function approveRequest_critical(uint index) public {
        Request storage request = requests[index];
        require(critical_approver == msg.sender);
        request.critical_approve = true;
    }
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        bool cond0 = (request.approvalCount > (approversCount/4)) && request.critical_approve;
        bool cond1 = request.approvalCount > (approversCount*9/10);
        require(cond0 || cond1);
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    function getSummay() public view returns(uint, uint, uint, uint, address, address){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager,
            critical_approver
        );
    }
    function getRequestsCount() public view returns(uint){
        return requests.length;
    }
}
