import {PlaceDto} from "../../../service/place.service";
import {TrailImportDto} from "../../../service/admin-trail.service";

export class TrailSaveProcessHelper {


    public constructor() {
    }
    /**
     * Saves the Trail and
     * process the related places
     *
     * 1. Check which intersection Places exists
     * exist?
     * [NO] -> create them & gets the IDs
     * [YES] -> ensure they exists - get them by IDs
     *
     * 2. Check which places Places exists
     * exist?
     * [NO] -> creates them & gets the IDs
     * [YES] -> ensure they exists - get them by IDs
     *
     * 3. Save the trail
     *
     * 4. Update trail with places
     * 5. Update places with trail IDs and coordinates
     *
     *
     * @param trail
     * @param intersections
     * @param places
     */
    public processSaveTrail(trail : TrailImportDto, intersections: PlaceDto, places: PlaceDto) {

    }

}