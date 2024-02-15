import React from 'react';
import UCSBOrganizationsForms from "main/components/UCSBOrganizations/UCSBOrganizationsForms"
import { ucsbOrganizationsFixtures } from 'fixtures/ucsbOrganizationsFixtures';


export default {
    title: 'components/UCSBOrganizations/UCSBOrganizationsForms',
    component: UCSBOrganizationsForms
};

const Template = (args) => {
    return (
        <UCSBOrganizationsForms {...args} />
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
    initialContents: ucsbOrganizationsFixtures.oneOrganizations[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};