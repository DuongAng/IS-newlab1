package com.brigada.is.mapper;

import com.brigada.is.domain.MusicBand;
import com.brigada.is.domain.Nomination;
import com.brigada.is.dto.response.NominationResponseDTO;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-05T00:25:43+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 18.0.2.1 (Eclipse Adoptium)"
)
public class NominationMapperImpl implements NominationMapper {

    @Override
    public Nomination toEntity(MusicBand e) {
        if ( e == null ) {
            return null;
        }

        Nomination nomination = new Nomination();

        nomination.setName( e.getName() );
        nomination.setGenre( e.getGenre() );

        return nomination;
    }

    @Override
    public NominationResponseDTO toResponseDTO(Nomination nomination) {
        if ( nomination == null ) {
            return null;
        }

        NominationResponseDTO nominationResponseDTO = new NominationResponseDTO();

        nominationResponseDTO.setId( nomination.getId() );
        nominationResponseDTO.setGenre( nomination.getGenre() );
        nominationResponseDTO.setNominationTime( nomination.getNominationTime() );

        return nominationResponseDTO;
    }
}
