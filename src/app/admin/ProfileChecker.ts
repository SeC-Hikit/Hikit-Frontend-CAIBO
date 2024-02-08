import {AuthService} from "../service/auth.service";

export enum profile {
    admin,
    maintainer,
    casualVolunteer,
    contentCreator,
    noProfile,
}

export class ProfileChecker {

    static async checkProfile(authService: AuthService, validProfile: profile): Promise<boolean> {
        let response = await authService.getUserProfile();
        console.log(response);
        if(response == 'admin' && validProfile == profile.admin) {
            console.log("all ok! Profile is valid");
            return Promise.resolve(true);
        }
        if(response == 'maintainer' && validProfile == profile.maintainer) {
            console.log("all ok! Profile is valid");
            return Promise.resolve(true);
        }
        if(response == 'casualVolunteer' && validProfile == profile.casualVolunteer) {
            console.log("all ok! Profile is valid");
            return Promise.resolve(true);
        }
        if(response == 'contentCreator' && validProfile == profile.contentCreator) {
            console.log("all ok! Profile is valid");
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }
}