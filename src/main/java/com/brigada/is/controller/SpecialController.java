package com.brigada.is.controller;

import com.brigada.is.domain.MusicBand;
import com.brigada.is.domain.MusicGenre;
import com.brigada.is.dto.response.MusicBandResponseDTO;
import com.brigada.is.dto.response.NominationResponseDTO;
import com.brigada.is.service.MusicBandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/special")
@RequiredArgsConstructor
public class SpecialController {
    private final MusicBandService musicBandService;




    @GetMapping("/count-by-studio")
    public ResponseEntity<Long> countByStudio(@RequestParam Long studioId) {
        return ResponseEntity.ok(musicBandService.countMusicBandByStudio(studioId));
    }

    @GetMapping("/albums-count-greater")
    public ResponseEntity<List<MusicBandResponseDTO>> getAlbumsCountGreater(@RequestParam Long albumsCount) {
        return ResponseEntity.ok(musicBandService.getAlbumsCountGreater(albumsCount));
    }

    @PostMapping("/nominate")
    public ResponseEntity<NominationResponseDTO> nominateBand(@RequestParam Long id) {
        return ResponseEntity.ok(musicBandService.nominate(id));
    }

    @PutMapping("/add-single")
    public ResponseEntity<MusicBandResponseDTO> addSingle(@RequestParam Long id) {
        return ResponseEntity.ok(musicBandService.addSingle(id));
    }

    @GetMapping("/min-description")
    public ResponseEntity<MusicBandResponseDTO> getBandWithMinDescription() {
        MusicBand band = musicBandService.getBandWithMinDescription();
        if (band == null) {
            return ResponseEntity.noContent().build(); // hoặc ResponseEntity.notFound().build()
        }
        // convert sang DTO để FE nhận
        MusicBandResponseDTO dto = new MusicBandResponseDTO(
                band.getId(),
                band.getName(),
                band.getDescription()
        );
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/count-studio-greater")
    public ResponseEntity<Long> countStudioGreater(@RequestParam Long studioId) {
        return ResponseEntity.ok(musicBandService.countMusicBandWithStudioGreaterThan(studioId));
    }

    @GetMapping("/studio-greater")
    public ResponseEntity<List<MusicBandResponseDTO>> getBandsWithStudioGreater(
            @RequestParam Long studioId) {
        List<MusicBand> bands = musicBandService.getBandsWithStudioGreater(studioId);
        List<MusicBandResponseDTO> dtoList = bands.stream()
                .map(band -> new MusicBandResponseDTO(band.getId(), band.getName(), band.getDescription()))
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/award-best")
    public ResponseEntity<NominationResponseDTO> awardBestBand(
            @RequestParam Long bandId,
            @RequestParam MusicGenre genre
    ) {
        return ResponseEntity.ok(musicBandService.awardBestBand(bandId, genre));
    }

}
