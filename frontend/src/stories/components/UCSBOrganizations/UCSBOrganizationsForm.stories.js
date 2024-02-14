import React from 'react';
import UCSBOrganizationsForm from "main/components/UCSBOrganization/UCSBOrganizationForm"
import { ucsbOrganizationsFixtures } from 'fixtures/ucsbOrganizationFixtures';


export default {
    title: 'components/UCSBOrganizations/UCSBOrganizationsForm',
    component: UCSBOrganizationsForm
};

const Template = (args) => {
    return (
        <UCSBOrganizationsForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
         console.log("Submit was clicked with data: ", data); 
         window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: ucsbOrganizationsFixtures.oneUCSBOrganization[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};