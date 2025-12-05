package com.brigada.is.mapper;

import com.brigada.is.dto.response.AdminApplicationResponseDTO;
import com.brigada.is.security.entity.AdminApplication;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-05T00:25:43+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 18.0.2.1 (Eclipse Adoptium)"
)
public class AdminApplicationMapperImpl implements AdminApplicationMapper {

    @Override
    public AdminApplicationResponseDTO toAdminApplicationResponseDTO(AdminApplication application) {
        if ( application == null ) {
            return null;
        }

        AdminApplicationResponseDTO adminApplicationResponseDTO = new AdminApplicationResponseDTO();

        adminApplicationResponseDTO.setId( application.getId() );
        adminApplicationResponseDTO.setUsername( application.getUsername() );

        return adminApplicationResponseDTO;
    }
}
