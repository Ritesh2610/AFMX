const ComplaintModel = require('../model/complaintModel');
const ClientModel = require('../model/clientModel');
const ServiceModel = require('../model/servicesModel');

const existingComplaintPortal = async (complaintDetails, evidencePicture, evidenceVideo) => {
    const {
        customerName,
        customerPhone,
        customerEmail,
        complaintServiceName,
        complaintType,
        complaintAddress,
        dateOfIncedent,
        createdBy,
        desireOutcome,
        complaintMessage,
        complaintStatusId,
        loggedInIds,
        adminId,
        createdDate,
        updatedDate,
    } = complaintDetails

    console.log("complaintDetails", complaintDetails);

    const clientIds = await ClientModel.findOne({ clientId: loggedInIds, isActive: true })
        .select('-_id clientId clientFirstName clientMiddleName clientLastName clientEmail clientPhone clientAddress1 clientAddress2 clientPostalCode');

    if (!clientIds) {
        throw new Error("Neither clientIds exists nor Active");
    }

    const constructName = (firstName, middleName, lastName) => {
        if (firstName && middleName && lastName) {
            return `${firstName} ${middleName} ${lastName}`;
        }
        return null;
    };

    let existingClientName;

    if (customerName) {
        existingClientName = customerName;
    } else {
        existingClientName = constructName(
            clientIds.clientFirstName,
            clientIds.clientMiddleName,
            clientIds.clientLastName
        );
    }

    const existingService = await ServiceModel.findOne({ serviceName: complaintServiceName, isActive: true })
        .select('-_id serviceId serviceName isActive');

    if (!existingService) {
        throw new Error("Neither service exists nor is active");
    }

    let dynamicFields = {};

    // Define the expected fields for each complaint type
    const expectedFields = {
        'Driver/Fleet Vehicle Complaint': ['driverName', 'badgeNo', 'licensePlateNo', 'other'],
        'Employee Complaint': ['employeeName', 'badgeNo', 'other'],
        'Billing Help': ['billingHelp', 'other'],
        'Other': ['other'] // No expected fields for 'Other' type
    };

    // Check if the complaint type is valid
    if (!Object.keys(expectedFields).includes(complaintType)) {
        throw new Error('Invalid complaint type selected.');
    }

    // Check if all expected fields are provided for the complaint type
    const expectedFieldNames = expectedFields[complaintType];
    const providedFieldNames = Object.keys(complaintDetails);

    const missingFields = expectedFieldNames.filter(fieldName => !providedFieldNames.includes(fieldName));
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields for ${complaintType}: ${missingFields.join(', ')}`);
    }
    // Populate dynamicFields based on the complaintType and expectedFields
    expectedFields[complaintType].forEach(field => {
        if (complaintDetails[field]) {
            dynamicFields[field] = complaintDetails[field];
        }
    });

    // Fetch the count of the complaint
    let complaintCount = await ComplaintModel.countDocuments();

    const complaintNewDetails = new ComplaintModel({
        complaintId: complaintCount + 1,
        customerName: existingClientName,
        customerPhone: customerPhone || clientIds.clientPhone,
        customerEmail: customerEmail || clientIds.clientEmail,
        complaintServiceName,
        complaintType,
        dynamicFields,
        evidencePicture: evidencePicture,
        evidenceVideo: evidenceVideo,
        complaintAddress: complaintAddress || clientIds.clientAddress1 + ' ' + clientIds.clientAddress2 + ' ' + clientIds.clientPostalCode,
        dateOfIncedent,
        createdBy,
        desireOutcome,
        complaintMessage,
        complaineeId: clientIds.clientId,
        complaintStatusId,
        adminId,
        createdDate,
        updatedDate,
    })
    const complaintCreateDetails = await complaintNewDetails.save();
    return complaintCreateDetails;
}

const nonExistingComplaintPortal = async (complaintDetails, evidencePicture, evidenceVideo) => {
    const {
        radioInputType,
        customerName,
        customerPhone,
        customerEmail,
        complaintType,
        complaintAddress,
        createdBy,
        desireOutcome,
        complaintMessage,
        dateOfIncedent,
        createdDate,
        updatedDate,
    } = complaintDetails
    console.log("This is the non Existing  Complaint",complaintDetails);
    let dynamicFields = {};

    // Define the expected fields for each complaint type
    const expectedFields = {
        'Driver/Fleet Vehicle Complaint': ['driverName', 'badgeNo', 'licensePlateNo', 'other'],
        'Employee Complaint': ['employeeName', 'badgeNo', 'other'],
        'Motor/Automobile Accident': ['Details', 'other'],
        'Suggestions How We Can Improve': ['Suggestions', 'other'] // No expected fields for 'Other' type
    };

    // Check if the complaint type is valid
    if (!Object.keys(expectedFields).includes(complaintType)) {
        throw new Error('Invalid complaint type selected.');
    }

    // Check if all expected fields are provided for the complaint type
    const expectedFieldNames = expectedFields[complaintType];
    const providedFieldNames = Object.keys(complaintDetails);

    const missingFields = expectedFieldNames.filter(fieldName => !providedFieldNames.includes(fieldName));
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields for ${complaintType}: ${missingFields.join(', ')}`);
    }
    // Populate dynamicFields based on the complaintType and expectedFields
    expectedFields[complaintType].forEach(field => {
        if (complaintDetails[field]) {
            dynamicFields[field] = complaintDetails[field];
        }
    });

    // Fetch the count of the complaint
    let complaintCount = await ComplaintModel.countDocuments();

    const complaintNewDetails = new ComplaintModel({
        complaintId: complaintCount + 1,
        radioInputType,
        customerName,
        customerPhone,
        customerEmail,
        complaintType,
        dynamicFields,
        evidencePicture: evidencePicture,
        evidenceVideo: evidenceVideo,
        complaintAddress,
        createdBy,
        desireOutcome,
        complaintMessage,
        dateOfIncedent,
        createdDate,
        updatedDate,
    })
  
const complaintCreateDetails = await complaintNewDetails.save();
return complaintCreateDetails;
}

// Get API's
const getAllCreateComplaintPortalService = async () => {
    const complaintPortalData = await ComplaintModel.find({});
    if (!complaintPortalData) {
        throw new Error(errorMsg.FETCH_USERS_FAILED);
    }
    return complaintPortalData;
};


module.exports = {
    existingComplaintPortal,
    nonExistingComplaintPortal,
    getAllCreateComplaintPortalService
}