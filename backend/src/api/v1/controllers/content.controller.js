import { ContentService } from '../services/content.service.js';
import { ContentTransformer } from '../transformers/content.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

// Create a shared instance or get from request
let contentServiceInstance = null;

const getContentService = (models) => {
  if (!contentServiceInstance) {
    contentServiceInstance = new ContentService(models.Content, models.ActivityLog);
  }
  return contentServiceInstance;
};

export const getAllContent = asyncHandler(async (req, res) => {
  const contentService = getContentService(req.models);
  const content = await contentService.getAllContent(req.tenantId);
  const transformed = content.map(c => ContentTransformer.toResponse(c));
  return successResponse(res, 200, 'Content retrieved', transformed);
});

export const getContentByPage = asyncHandler(async (req, res) => {
  const contentService = getContentService(req.models);
  const content = await contentService.getContentByPage(req.params.page, req.tenantId);
  return successResponse(res, 200, 'Content retrieved', ContentTransformer.toResponse(content));
});

export const updateContent = asyncHandler(async (req, res) => {
  const contentService = getContentService(req.models);
  const { page } = req.body;
  if (!page) throw new ValidationError('Page field required');
  
  const userId = req.user?.sub || req.user?.id || null;
  const username = req.user?.username || req.user?.email || req.user?.name || 'system';
  
  const updated = await contentService.updateContent(
    page, 
    req.tenantId, 
    req.body, 
    userId, 
    username
  );
  
  return successResponse(res, 200, 'Content updated', ContentTransformer.toResponse(updated));
});

export const updateSection = asyncHandler(async (req, res) => {
  const contentService = getContentService(req.models);
  const { page, section } = req.params;
  const { content } = req.body;
  const updated = await contentService.updateSection(page, section, content, req.tenantId, req.user.sub);
  return successResponse(res, 200, 'Section updated', ContentTransformer.toResponse(updated));
});

export const deleteContent = asyncHandler(async (req, res) => {
  const contentService = getContentService(req.models);
  await contentService.deleteContent(req.params.id, req.tenantId);
  return successResponse(res, 204, 'Content deleted');
});

export const togglePublish = asyncHandler(async (req, res) => {
  const contentService = getContentService(req.models);
  const content = await contentService.togglePublish(req.params.id, req.tenantId);
  return successResponse(res, 200, 'Publish status toggled', ContentTransformer.toResponse(content));
});

// Get content version endpoint
export const getContentVersion = asyncHandler(async (req, res) => {
  const contentService = getContentService(req.models);
  try {
    const content = await contentService.getContentByPage('home', req.tenantId);
    return successResponse(res, 200, 'Content version', {
      version: content.updatedAt || content.version || Date.now(),
      lastUpdated: content.updatedAt || new Date().toISOString()
    });
  } catch (error) {
    // If content doesn't exist, return default version
    return successResponse(res, 200, 'Content version', {
      version: Date.now(),
      lastUpdated: new Date().toISOString()
    });
  }
});
