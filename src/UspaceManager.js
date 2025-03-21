import axios from "axios";
import { getToken } from './tokenManager.js';

class UspaceManager {
    async sendRequest(options) {
        const token = getToken();
    
        options.headers = {
            ...options.headers,
            accept: 'application/json',
            authorization: `Bearer ${token}`
        };
    
        if (['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase())) {
            options.headers['Content-Type'] = 'application/json';
        }
    
        try {
            return await axios.request(options);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async search(param) {
        if (typeof param !== 'string') param = String(param);

        const options = {
            method: 'GET',
            url: `https://${process.env.SPACE}.uspacy.ua/search/v1/search`,
            params: {
                q: param,
            }
          };
        const res = await this.sendRequest(options);

        return res.data.data;
    }

    async getFieldTypes() {
        const options = {
            method: 'GET',
            url: `https://${process.env.SPACE}.uspacy.ua/crm/v1/field_types`
        };        
        const res = await this.sendRequest(options);

        return res.data.data;
    }

    async getEntityFields(entity) {
        if (typeof entity !== 'string') entity = String(entity);

        const options = {
            method: 'GET',
            url: `https://${process.env.SPACE}.uspacy.ua/crm/v1/entities/${entity}/fields`
        };        
        const res = await this.sendRequest(options);

        return res.data.data;
    }

    async getEntityFieldByItemCode(entity, code) {
        if (typeof entity !== 'string') entity = String(entity);
        if (typeof code !== 'string') code = String(code);

        const options = {
            method: 'GET',
            url: `https://${process.env.SPACE}.uspacy.ua/crm/v1/entities/${entity}/fields/${code}`
        };        
        const res = await this.sendRequest(options);

        return res.data;
    }

    async getEntity(entity, itemId) {
        if (typeof entity !== 'string') entity = String(entity);
        if (typeof itemId !== 'string') itemId = String(itemId);

        const options = {
            method: 'GET',
            url: `https://${process.env.SPACE}.uspacy.ua/crm/v1/entities/${entity}/${itemId}`
        };
        const res = await this.sendRequest(options);

        return res.data;
    }

    async editEntityItem(entity, itemId, field, value) {
        if (typeof entity !== 'string') entity = String(entity);
        if (typeof field !== 'string') field = String(field);
        if (typeof value !== 'string') value = String(value);

        const options = {
            method: 'PATCH',
            url: `https://${process.env.SPACE}.uspacy.ua/crm/v1/entities/${entity}/${itemId}`,
            data: {[field]: value}
        };
        const res = await this.sendRequest(options);

        return res.data;
    }

    async getKEPsByCompany(companyId) {
        if (typeof companyId !== 'string') companyId = String(companyId);

        const options = {
            method: 'GET',
            url: `https://${process.env.SPACE}.uspacy.ua/crm/v1/entities/companies/${companyId}/related/keps/`
        };
        const res = await this.sendRequest(options);

        return res.data.data;
    }

    async deleteKEP(itemId) {
        const options = {
            method: 'DELETE',
            url: `https://${process.env.SPACE}.uspacy.ua/crm/v1/entities/keps/${itemId}`
        };
        const res = await this.sendRequest(options);

        return res.data;
    }

    async createKEPEntityForCompany(companyId, title, owner, data_formuvannya, data_zakinchennya, na_cloudkey) {
        if (typeof companyId !== 'string') companyId = String(companyId);
        if (typeof title !== 'string') title = String(title);
        if (typeof owner !== 'string') owner = String(owner);

        const options = {
            method: 'POST',
            url: `https://${process.env.SPACE}.uspacy.ua/crm/v1/entities/keps`,
            data: {
                title: title,
                owner: owner, // is not necessery
                data_formuvannya: data_formuvannya,
                data_zakinchennya: data_zakinchennya,
                na_cloudkey: na_cloudkey,
                kompaniya: {id: companyId}
            }
        };
        const res = await this.sendRequest(options);

        return res.data;
    }
};

export default UspaceManager;