import {AuthService} from "../service/auth.service";

export class ProfileChecker {

    constructor(private authService: AuthService) {
    }

    checkProfile(validProfile: string): boolean {
        this.authService.getUserProfile().then((resp) => {
            console.log(resp);
            if (resp == validProfile) {
                return true;
            }
        });
        return false;
    }
}