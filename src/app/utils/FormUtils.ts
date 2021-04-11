import { FormControl, FormGroup, Validators } from '@angular/forms';

export class FormUtils {

    public static DEFAULT_CYCLO = "UNCLASSIFIED";

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
    
    public static getCylcloFormGroup(){
        return new FormGroup({
            "classification": new FormControl(this.DEFAULT_CYCLO, Validators.required),
            "wayForward": this.getWayCylcloFormGroup(),
            "wayBack": this.getWayCylcloFormGroup(),
            "description": new FormControl(""),
        });
    }

    public static getWayCylcloFormGroup(){
        return new FormGroup({
            "feasible": new FormControl("", Validators.required),
            "portage": new FormControl(""),
        });
    }
}