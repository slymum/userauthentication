const chai=require('chai')
const assert = chai.assert
const expect = chai.expect
const sinon = require('sinon')
const userModel = require('../models/userModel')
const securityUtils = require('../utilities/securityUtils')
const testData = require('../test/testData')


const mockRequest = (path, user, method, pathParamID="")=> {
    const req = {
        'originalUrl': path,
        'method': method,
        'user': user
    }
    req.params = {}
    if (pathParamID) {
        req.params.id = pathParamID
    }
    return req
}

const mockRespose = ()=> {
    const res = {

    }
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res
}


describe('Test securityUtils', function (){

    let nextSpy = {}
    let res ={}
    before(function (){

    })

    after( function(){
    })
    beforeEach(()=>{
        nextSpy = sinon.spy()
        res = mockRespose()
    })
    afterEach(() => {

        sinon.restore();
    });

    it('test authorized  ADMIN role - GET - a user', ()=>{
        let req = mockRequest("/users/test",testData.ADMINUSER,"GET")
        securityUtils.isAuthorized(req,res,nextSpy)
        expect(nextSpy.calledOnce).to.be.true
    })

    it('test invalid route - GET',()=>{
        let req = mockRequest("/usersb/test",testData.ADMINUSER,"GET")
        let nextSpy = sinon.spy()
        let res = mockRespose()
        securityUtils.isAuthorized(req,res,nextSpy)
        expect(res.status.calledWith(testData.UNAUTHZ.code)).to.be.true
        expect(res.json.calledWith(testData.UNAUTHZ.message)).to.be.true
        expect(nextSpy.called).to.be.false
    })

    it('test authorized  SUPERVISOR role - GET - self ', ()=>{
        let req = mockRequest("/users/test",testData.SUPERVISOR,"GET","test")
        securityUtils.isAuthorized(req,res,nextSpy)
        expect(nextSpy.calledOnce).to.be.true
    })

    it('test authorized  SUPERVISOR role -- GET -- team member list ', ()=>{
        let req = mockRequest("/users/",testData.SUPERVISOR,"GET")
        securityUtils.isAuthorized(req,res,nextSpy)
        expect(nextSpy.calledOnce).to.be.true
    })

    it('test authorized  SUPERVISOR role -- GET -- team member list ', async ()=>{
        let req = mockRequest("/users/test2",testData.SUPERVISOR,"GET","test2")
        sinon.stub(userModel, "find").returns(testData.MOCK_FIND_USERS)
        await securityUtils.isAuthorized(req,res,nextSpy)
        expect(nextSpy.calledOnce).to.be.true
    })



    it('test unauthorized  SUPERVISOR role -- GET -- team member list ', async ()=>{
        let req = mockRequest("/users/test3",testData.SUPERVISOR,"GET","test3")
        sinon.stub(userModel, "find").returns(testData.MOCK_FIND_USERS)
        await securityUtils.isAuthorized(req,res,nextSpy)
        expect(res.status.calledWith(testData.UNAUTHZ.code)).to.be.true
        expect(res.json.calledWith(testData.UNAUTHZ.message)).to.be.true
        expect(nextSpy.called).to.be.false
    })

    it('test authorized  EMP role -- GET -- self ',  ()=>{
        let req = mockRequest("/users/test",testData.EMP,"GET","test")
        securityUtils.isAuthorized(req,res,nextSpy)
        expect(nextSpy.calledOnce).to.be.true
    })


    it('test unauthorized  EMP role -- GET -- other ',  ()=>{
        let req = mockRequest("/users/test3",testData.EMP,"GET","test3")
        securityUtils.isAuthorized(req,res,nextSpy)
        expect(res.status.calledWith(testData.UNAUTHZ.code)).to.be.true
        expect(res.json.calledWith(testData.UNAUTHZ.message)).to.be.true
        expect(nextSpy.called).to.be.false
    })

    it('test unauthorized  EMP role -- DELETE -- SELF ',  ()=>{
        let req = mockRequest("/users/test",testData.EMP,"DELETE","test")
        securityUtils.isAuthorized(req,res,nextSpy)
        expect(res.status.calledWith(testData.UNAUTHZ.code)).to.be.true
        expect(res.json.calledWith(testData.UNAUTHZ.message)).to.be.true
        expect(nextSpy.called).to.be.false
    })

    it('test unauthorized  SUPERVISOR role -- DELETE -- SELF ',  ()=>{
        let req = mockRequest("/users/test",testData.SUPERVISOR,"DELETE","test")
        securityUtils.isAuthorized(req,res,nextSpy)
        expect(res.status.calledWith(testData.UNAUTHZ.code)).to.be.true
        expect(res.json.calledWith(testData.UNAUTHZ.message)).to.be.true
        expect(nextSpy.called).to.be.false
    })

    it('test unauthorized  SUPERVISOR role -- GET -- Non team member ',  async ()=>{
        let req = mockRequest("/users/test3",testData.SUPERVISOR,"GET","test3")
        sinon.stub(userModel, "find").returns(testData.MOCK_FIND_USERS)
        await securityUtils.isAuthorized(req,res,nextSpy)
        expect(res.status.calledWith(testData.UNAUTHZ.code)).to.be.true
        expect(res.json.calledWith(testData.UNAUTHZ.message)).to.be.true
        expect(nextSpy.called).to.be.false
    })
});

