import {PlaceDto, PlaceRefDto, PlaceResponse, PlaceService} from "../../../service/place.service";
import {AdminTrailService, TrailImportDto} from "../../../service/admin-trail.service";
import {FileDetailsDto, TrailCoordinatesDto, TrailResponse} from "../../../service/trail-service.service";


export interface TrailDataForSaving {
    code: string;
    name: string;
    description: string;
    officialEta: number;
    classification?: "T" | "E" | "EE" | "EEA" | "UNCLASSIFIED";
    country: string;
    coordinates: TrailCoordinatesDto[];
    maintainingSection: string;
    territorialDivision: string;
    linkedMediaDtos: string[];
    lastUpdate: string;
    fileDetailsDto: FileDetailsDto;
    trailStatus?: "DRAFT" | "PUBLIC";
    variant: boolean;
}

export class TrailSaveProcessHelper {

    public constructor(
        private placeService: PlaceService,
        private adminTrailService: AdminTrailService) {
    }

    public async importTrail(trailData: TrailDataForSaving,
                             intersections: PlaceRefDto[],
                             places: PlaceRefDto[],
                             onComplete: (trailResponse: TrailResponse) => void,
                             onError: (errors: string[]) => void) {

        console.log("Saving trail...")
        const trailImport: TrailImportDto = {
            name: trailData.name,
            coordinates: trailData.coordinates,
            variant: trailData.variant,
            startLocation: places[0],
            endLocation: places[places.length - 1],
            locations: places,
            crossways: intersections,
            fileDetailsDto: trailData.fileDetailsDto,
            officialEta: trailData.officialEta,
            territorialDivision: trailData.territorialDivision,
            lastUpdate: trailData.lastUpdate,
            trailStatus: trailData.trailStatus,
            linkedMediaDtos: [],
            description: trailData.description,
            country: trailData.country,
            maintainingSection: trailData.maintainingSection,
            id: trailData.code,
            classification: trailData.classification
        };

        this.adminTrailService.saveTrail(trailImport)
            .toPromise().then((resp) => {
            if (resp.status == "OK") {
                onComplete(resp);
            } else {
                onError(resp.messages)
            }
        });
    }

}