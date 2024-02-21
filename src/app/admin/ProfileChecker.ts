import {AuthService} from "../service/auth.service";

export enum Profile {
    admin,
    maintainer,
    casualVolunteer,
    contentCreator,
    noProfile,
}

export class ProfileChecker {

    static async checkProfile(authService: AuthService, validProfiles: Profile[]): Promise<boolean> {
        let response = await authService.getUserProfile();
        console.log(response);
        switch(response) {
            case 'admin':
                for (let validProfile of validProfiles) {
                    if (validProfile == Profile.admin) {
                        return Promise.resolve(true);
                    }
                }
            case 'maintainer':
                for (let validProfile of validProfiles) {
                    if (validProfile == Profile.maintainer) {
                        return Promise.resolve(true);
                    }
                }
            case 'casual_volunteer':
                for (let validProfile of validProfiles) {
                    if (validProfile == Profile.casualVolunteer) {
                        return Promise.resolve(true);
                    }
                }
            case 'content_creator':
                for (let validProfile of validProfiles) {
                    if (validProfile == Profile.contentCreator) {
                        return Promise.resolve(true);
                    }
                }
        }
        return Promise.resolve(false);
    }

    static profileToString(profileIn: string): string {
        switch(profileIn) {
            case 'admin':
                return 'Amministratore';
            case 'maintainer':
                return 'Manutentore';
            case 'casual_volunteer':
                return 'Volontario';
            case 'content_creator':
                return 'Creatore di Contenuti';
        }
        return '';
    }
}