import { FormControl, FormGroup, Validators } from '@angular/forms';

export class FormUtils {
    public static getLocationFormGroup(){
        return new FormGroup({
            "name": new FormControl("", Validators.minLength(0)),
            "tags": new FormControl(""),
            "latitude": new FormControl("", Validators.required),
            "longitude": new FormControl("", Validators.required),
            "altitude": new FormControl("", Validators.required),
            "distanceFromTrailStart": new FormControl("", Validators.required)
        });
    } 
}